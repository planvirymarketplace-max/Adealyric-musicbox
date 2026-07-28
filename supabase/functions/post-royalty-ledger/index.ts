// supabase/functions/post-royalty-ledger/index.ts
//
// Given a RoyaltyStatement (already computed — see Section 10.3's
// calculation flow), posts the double-entry ledger transaction that
// actually moves the money on paper:
//
//   Debit  "Distribution Revenue Clearing"     (asset, platform)
//   Credit "Royalties Payable — <Participant>" (liability, per participant)
//     ... one credit line per RoyaltyLineItem, split across participants
//
// The debits and credits are constructed to sum to exactly zero before
// insert; the Postgres trigger in 0002_ledger_balance_and_rls.sql is the
// backstop if this function ever has a bug.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function getOrCreateAccount(
  organizationId: string,
  code: string,
  name: string,
  type: string,
  ownerType = "PLATFORM",
  ownerId: string | null = null,
) {
  const { data: existing } = await supabase
    .from("LedgerAccount")
    .select("id")
    .eq("organizationId", organizationId)
    .eq("code", code)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("LedgerAccount")
    .insert({ organizationId, code, name, type, ownerType, ownerId })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create account ${code}: ${error.message}`);
  return created.id;
}

serve(async (req) => {
  try {
    const { royaltyStatementId } = await req.json();
    if (!royaltyStatementId) {
      return new Response(JSON.stringify({ error: "royaltyStatementId is required" }), { status: 400 });
    }

    const { data: statement, error: stmtError } = await supabase
      .from("RoyaltyStatement")
      .select("id, organizationId, status, lineItems:RoyaltyLineItem(id, participantId, amount, source)")
      .eq("id", royaltyStatementId)
      .single();

    if (stmtError || !statement) {
      return new Response(JSON.stringify({ error: stmtError?.message ?? "Statement not found" }), {
        status: 404,
      });
    }
    if (statement.status === "paid") {
      return new Response(JSON.stringify({ error: "Statement already posted and paid" }), { status: 409 });
    }

    const orgId = statement.organizationId;
    const clearingAccountId = await getOrCreateAccount(
      orgId,
      "1000-DISTRIBUTION-CLEARING",
      "Distribution Revenue Clearing",
      "ASSET",
    );

    const totalAmount = statement.lineItems.reduce((sum: number, li: any) => sum + Number(li.amount), 0);

    // 1. Create the transaction shell
    const { data: transaction, error: txError } = await supabase
      .from("LedgerTransaction")
      .insert({
        organizationId: orgId,
        memo: `Royalty statement ${royaltyStatementId} posted`,
        sourceType: "DSP_ROYALTY",
        sourceId: royaltyStatementId,
      })
      .select("id")
      .single();

    if (txError) throw new Error(txError.message);

    // 2. One debit for the total, pulling money out of clearing...
    const entries = [
      {
        transactionId: transaction.id,
        accountId: clearingAccountId,
        direction: "DEBIT",
        amount: totalAmount,
      },
    ];

    // 3. ...and one credit per participant, crediting what's now owed to them
    for (const lineItem of statement.lineItems) {
      const payableAccountId = await getOrCreateAccount(
        orgId,
        `2100-PAYABLE-${lineItem.participantId ?? "UNASSIGNED"}`,
        `Royalties Payable — ${lineItem.participantId ?? "Unassigned"}`,
        "LIABILITY",
        "PARTICIPANT",
        lineItem.participantId,
      );
      entries.push({
        transactionId: transaction.id,
        accountId: payableAccountId,
        direction: "CREDIT",
        amount: Number(lineItem.amount),
      });
    }

    const { error: entriesError } = await supabase.from("LedgerEntry").insert(entries);
    if (entriesError) throw new Error(entriesError.message);

    await supabase.from("RoyaltyStatement").update({ status: "posted", totalAmount }).eq(
      "id",
      royaltyStatementId,
    );

    return new Response(JSON.stringify({ transactionId: transaction.id, totalAmount }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
