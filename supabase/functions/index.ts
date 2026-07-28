// supabase/functions/generate-split-sheet-pdf/index.ts
//
// Deno edge function. Given a splitSheetId, renders the executable
// split-sheet PDF with pdf-lib, uploads it to the "documents" bucket, and
// writes the resulting Asset row + SplitSheet.pdfAssetId back to Postgres.
//
// This is glue work (fetch rows, draw text, upload a file) — exactly what
// Supabase Edge Functions (Deno, short-lived, no GPU) are good for. It is
// NOT where stem separation / mastering / voice conversion belong; see
// the AiJob model and the worker-service note in production-architecture.md.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // service role: bypasses RLS, this function is the trusted boundary
);

interface SplitParticipant {
  id: string;
  role: string;
  percentage: number;
  artist?: { name: string } | null;
  signatures: { signedAt: string | null }[];
}

serve(async (req) => {
  try {
    const { splitSheetId } = await req.json();
    if (!splitSheetId) {
      return new Response(JSON.stringify({ error: "splitSheetId is required" }), { status: 400 });
    }

    // 1. Fetch the split sheet with participants + track/song title
    const { data: splitSheet, error: fetchError } = await supabase
      .from("SplitSheet")
      .select(
        `id, organizationId, status,
         track:trackId ( title ),
         song:songId ( title ),
         participants:SplitParticipant (
           id, role, percentage,
           artist:artistId ( name ),
           signatures:SplitSignature ( signedAt )
         )`,
      )
      .eq("id", splitSheetId)
      .single();

    if (fetchError || !splitSheet) {
      return new Response(JSON.stringify({ error: fetchError?.message ?? "Split sheet not found" }), {
        status: 404,
      });
    }

    const songTitle = splitSheet.track?.title ?? splitSheet.song?.title ?? "Untitled";
    const participants: SplitParticipant[] = splitSheet.participants ?? [];

    // Sanity check before generating a legal document from bad data --
    // catch this here rather than shipping a PDF that implies 100% doesn't add up.
    const totalPct = participants.reduce((sum, p) => sum + p.percentage, 0);
    if (Math.round(totalPct * 100) !== 10000) {
      return new Response(
        JSON.stringify({ error: `Splits total ${totalPct}%, must total 100% before PDF export` }),
        { status: 422 },
      );
    }

    // 2. Draw the PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 740;
    const left = 56;

    page.drawText("SPLIT SHEET", { x: left, y, size: 20, font: bold });
    y -= 30;
    page.drawText(`Song: ${songTitle}`, { x: left, y, size: 12, font });
    y -= 18;
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: left, y, size: 12, font });
    y -= 36;

    page.drawText("Writer / Role", { x: left, y, size: 11, font: bold });
    page.drawText("Share", { x: left + 300, y, size: 11, font: bold });
    page.drawText("Signed", { x: left + 400, y, size: 11, font: bold });
    y -= 8;
    page.drawLine({ start: { x: left, y }, end: { x: 556, y }, thickness: 1, color: rgb(0, 0, 0) });
    y -= 20;

    for (const p of participants) {
      const name = p.artist?.name ?? "Unassigned";
      const signed = p.signatures?.some((s) => !!s.signedAt) ? "Yes" : "Pending";
      page.drawText(`${name} — ${p.role}`, { x: left, y, size: 11, font });
      page.drawText(`${p.percentage}%`, { x: left + 300, y, size: 11, font });
      page.drawText(signed, { x: left + 400, y, size: 11, font });
      y -= 22;
    }

    y -= 30;
    page.drawText(
      "This split sheet reflects ownership shares as agreed by the parties above.",
      { x: left, y, size: 9, font, color: rgb(0.35, 0.35, 0.35) },
    );

    const pdfBytes = await pdfDoc.save();

    // 3. Upload to the "documents" bucket
    const storageKey = `split-sheets/${splitSheetId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storageKey, pdfBytes, { contentType: "application/pdf", upsert: true });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    // 4. Record the Asset row and link it back to the SplitSheet
    const { data: asset, error: assetError } = await supabase
      .from("Asset")
      .insert({
        organizationId: splitSheet.organizationId,
        type: "DOCUMENT",
        bucket: "documents",
        storageKey,
      })
      .select()
      .single();

    if (assetError) {
      return new Response(JSON.stringify({ error: assetError.message }), { status: 500 });
    }

    await supabase.from("SplitSheet").update({ pdfAssetId: asset.id }).eq("id", splitSheetId);

    const { data: signedUrl } = await supabase.storage
      .from("documents")
      .createSignedUrl(storageKey, 60 * 60); // 1 hour

    return new Response(JSON.stringify({ assetId: asset.id, url: signedUrl?.signedUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
