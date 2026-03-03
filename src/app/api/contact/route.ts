import { NextResponse } from "next/server";
import { appendMessage } from "@/lib/store";
import nodemailer from "nodemailer";

// ── Simple in-memory rate limiter ──────────────────
const rateMap = new Map<string, { count: number; first: number }>();
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT     = 3;               // max 3 submissions per IP per hour

function isRateLimited(ip: string): boolean {
  const now    = Date.now();
  const record = rateMap.get(ip);

  if (!record || now - record.first > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, first: now });
    return false;
  }
  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}

// ── Optional email notification ────────────────────
async function sendEmailNotification(data: {
  name: string; email: string; company?: string; message: string;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) return; // email not configured

  const transporter = nodemailer.createTransport({
    host:   SMTP_HOST,
    port:   parseInt(SMTP_PORT ?? "587"),
    secure: false,
    auth:   { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from:    `"Portfolio Contact" <${SMTP_USER}>`,
    to:      NOTIFY_EMAIL,
    subject: `Portfolio contact: ${data.name}`,
    text: [
      `From: ${data.name} <${data.email}>`,
      data.company ? `Company: ${data.company}` : "",
      "",
      data.message,
    ].filter(Boolean).join("\n"),
  });
}

// ── POST handler ────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip        = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, company, message } = body as Record<string, string>;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "name, email and message are required" },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Length limits
    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const saved = appendMessage({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      company: company?.trim(),
      message: message.trim(),
    });

    // Fire-and-forget email notification (don't fail the request if email fails)
    sendEmailNotification({ name, email, company, message }).catch(console.error);

    return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
