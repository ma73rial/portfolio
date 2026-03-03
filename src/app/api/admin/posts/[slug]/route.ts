import { NextResponse } from "next/server";
import { deletePostFile, checkAdminAuth } from "@/lib/store";

interface Params { params: Promise<{ slug: string }> }

export async function DELETE(req: Request, { params }: Params) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const deleted   = deletePostFile(slug);
  if (!deleted) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
