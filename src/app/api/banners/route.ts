import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const published = req.nextUrl.searchParams.get("published");
    const banners = await db.banner.findMany({
      where: published === "true" ? { published: true } : undefined,
      orderBy: { sortOrder: "asc" },
    });
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
    const banner = await db.banner.create({
      data: {
        title,
        subtitle: subtitle ?? null,
        imageUrl: imageUrl ?? null,
        ctaText: ctaText ?? null,
        ctaLink: ctaLink ?? null,
        position: position ?? "hero",
        published: published ?? false,
        sortOrder: sortOrder ?? 0,
      },
    });
    return NextResponse.json({ banner }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
