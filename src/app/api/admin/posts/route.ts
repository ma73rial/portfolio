import { NextResponse } from "next/server";
import { listPostFiles, createPostFile, checkAdminAuth } from "@/lib/store";

export async function GET(req: Request) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(listPostFiles());
}

export async function POST(req: Request) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, title, date, excerpt, tags, content } = body as {
    slug:    string;
    title:   string;
    date:    string;
    excerpt: string;
    tags:    string[];
    content: string;
  };

  if (!slug || !title || !content)
    return NextResponse.json({ error: "slug, title, and content are required" }, { status: 400 });

  // Sanitize slug
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

  try {
    createPostFile(safeSlug, title, date || new Date().toISOString().slice(0, 10), excerpt || "", tags || [], content);
    return NextResponse.json({ success: true, slug: safeSlug }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
