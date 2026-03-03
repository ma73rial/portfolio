import { NextResponse } from "next/server";
import { readMessages, writeMessages, checkAdminAuth } from "@/lib/store";

interface Params { params: Promise<{ id: string }> }

// PATCH — mark as read
export async function PATCH(req: Request, { params }: Params) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const msgs    = readMessages();
  const idx     = msgs.findIndex(m => m.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  msgs[idx].read = true;
  writeMessages(msgs);
  return NextResponse.json(msgs[idx]);
}

// DELETE — remove message
export async function DELETE(req: Request, { params }: Params) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const msgs    = readMessages();
  const filtered = msgs.filter(m => m.id !== id);
  if (filtered.length === msgs.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  writeMessages(filtered);
  return NextResponse.json({ success: true });
}
