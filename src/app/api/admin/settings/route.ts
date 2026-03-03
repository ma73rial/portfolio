import { NextResponse }            from "next/server";
import { readSettings, writeSettings, checkAdminAuth } from "@/lib/store";

export async function GET(req: Request) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(readSettings());
}

export async function PUT(req: Request) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body    = await req.json();
  const updated = writeSettings(body);
  return NextResponse.json(updated);
}
