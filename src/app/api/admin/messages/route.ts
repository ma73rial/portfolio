import { NextResponse } from "next/server";
import { readMessages, checkAdminAuth } from "@/lib/store";

export async function GET(req: Request) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const msgs = readMessages();
  return NextResponse.json(msgs);
}
