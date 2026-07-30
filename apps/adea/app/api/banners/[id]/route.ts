import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function toCamelCase(b: any) {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.image_url,
    ctaText: b.cta_text,
    ctaLink: b.cta_link,
    position: b.position,
    published: b.published,
    sortOrder: b.sort_order,
    created_at: b.created_at,
    updated_at: b.updated_at,
  };
}

function toSnakeCase(body: any) {
  const result: any = {};
  if (body.title !== undefined) result.title = body.title;
  if (body.subtitle !== undefined) result.subtitle = body.subtitle;
  if (body.imageUrl !== undefined) result.image_url = body.imageUrl;
  if (body.ctaText !== undefined) result.cta_text = body.ctaText;
  if (body.ctaLink !== undefined) result.cta_link = body.ctaLink;
  if (body.position !== undefined) result.position = body.position;
  if (body.published !== undefined) result.published = body.published;
  if (body.sortOrder !== undefined) result.sort_order = body.sortOrder;
  return result;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const snakeData = toSnakeCase(body);

    const { data, error } = await supabase
      .from("cms_banners")
      .update(snakeData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ banner: toCamelCase(data) });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("cms_banners")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
