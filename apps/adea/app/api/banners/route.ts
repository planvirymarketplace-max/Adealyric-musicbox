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

export async function GET(req: NextRequest) {
  try {
    const published = req.nextUrl.searchParams.get("published");
    let query = supabase.from("cms_banners").select("*").order("sort_order", { ascending: true });

    if (published === "true") {
      query = query.eq("published", true);
    }

    const { data, error } = await query;
    if (error) throw error;

    const banners = (data ?? []).map(toCamelCase);
    return NextResponse.json({ banners });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle, imageUrl, ctaText, ctaLink, position, published, sortOrder } = body;
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const snakeData = {
      title,
      subtitle: subtitle ?? null,
      image_url: imageUrl ?? "",
      cta_text: ctaText ?? null,
      cta_link: ctaLink ?? null,
      position: position ?? "hero",
      published: published ?? false,
      sort_order: sortOrder ?? 0,
    };

    const { data, error } = await supabase
      .from("cms_banners")
      .insert([snakeData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ banner: toCamelCase(data) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
