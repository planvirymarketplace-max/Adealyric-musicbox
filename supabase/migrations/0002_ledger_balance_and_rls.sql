-- ============================================================================
-- Ledger balance enforcement
-- ============================================================================
-- The app always writes a LedgerTransaction and its LedgerEntry rows inside
-- one Prisma `$transaction`, but a trigger is the real backstop: it fires
-- on every INSERT/UPDATE/DELETE of "LedgerEntry" and rejects the write if
-- the parent transaction's entries don't sum to zero (debits positive,
-- credits negative). This is the Postgres-level equivalent of ledger-cli
-- refusing to parse an unbalanced entry.

create or replace function check_ledger_transaction_balance()
returns trigger as $$
declare
  tx_id text;
  balance numeric;
begin
  tx_id := coalesce(new."transactionId", old."transactionId");

  select coalesce(sum(
    case when direction = 'DEBIT' then amount else -amount end
  ), 0)
  into balance
  from "LedgerEntry"
  where "transactionId" = tx_id;

  if balance <> 0 then
    raise exception
      'Ledger transaction % is unbalanced by %. Debits must equal credits.',
      tx_id, balance;
  end if;

  return new;
end;
$$ language plpgsql;

-- Deferred so multi-row inserts of a single transaction's entries (which
-- individually may look unbalanced mid-insert) are only checked once the
-- whole batch commits.
create constraint trigger ledger_entry_balance_check
after insert or update or delete on "LedgerEntry"
deferrable initially deferred
for each row
execute function check_ledger_transaction_balance();

-- ============================================================================
-- Row Level Security — tenant isolation
-- ============================================================================
-- Applied the same way across every org-scoped table. Shown here for the
-- money tables since they're the highest-stakes; replicate this policy
-- shape for Track, Release, Asset, RightsRecord, etc.

alter table "LedgerAccount" enable row level security;
alter table "LedgerTransaction" enable row level security;
alter table "LedgerEntry" enable row level security;

create policy "org_isolation_ledger_account" on "LedgerAccount"
  for all
  using ("organizationId" = (auth.jwt() ->> 'organization_id'));

create policy "org_isolation_ledger_transaction" on "LedgerTransaction"
  for all
  using ("organizationId" = (auth.jwt() ->> 'organization_id'));

-- LedgerEntry has no organizationId of its own by design (it inherits scope
-- from its parent transaction) — join through the transaction instead.
create policy "org_isolation_ledger_entry" on "LedgerEntry"
  for all
  using (
    exists (
      select 1 from "LedgerTransaction" t
      where t.id = "LedgerEntry"."transactionId"
      and t."organizationId" = (auth.jwt() ->> 'organization_id')
    )
  );

-- ============================================================================
-- Sync marketplace — the one deliberate cross-tenant read
-- ============================================================================

alter table "SyncListing" enable row level security;
alter table "DealRoom" enable row level security;

-- Any authenticated org can browse available listings (this is the
-- marketplace); only the licensor can manage the listing itself.
create policy "sync_listing_public_read" on "SyncListing"
  for select
  using (status = 'available');

create policy "sync_listing_licensor_write" on "SyncListing"
  for insert, update, delete
  using (
    exists (
      select 1 from "Track" tr
      where tr.id = "SyncListing"."trackId"
      and tr."organizationId" = (auth.jwt() ->> 'organization_id')
    )
  );

-- A DealRoom is only visible to the two parties actually in it.
create policy "deal_room_participants_only" on "DealRoom"
  for all
  using (
    "licensorOrgId" = (auth.jwt() ->> 'organization_id')
    or "buyerOrgId" = (auth.jwt() ->> 'organization_id')
  );
