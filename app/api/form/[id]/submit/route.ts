import { NextRequest, NextResponse } from "next/server";
import { getFormById, logSubmission } from "@/lib/forms";

// In-memory rate limit: 5 submissions per IP per 10 minutes
const rateMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 5;
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please wait a few minutes." }, { status: 429 });
  }

  const form = await getFormById(params.id);
  if (!form || !form.active) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate required fields
  for (const field of form.fields) {
    if (field.required && field.type !== "checkbox") {
      const val = (body[field.id] as string | undefined)?.trim();
      if (!val) {
        return NextResponse.json({ error: `${field.label} is required` }, { status: 400 });
      }
    }
  }

  // Build clean data map for logging + n8n
  const data: Record<string, string> = {};
  for (const field of form.fields) {
    const val = body[field.id];
    if (val !== undefined && val !== null) {
      data[field.label] = String(val).trim();
    }
  }

  // Log submission to DB
  await logSubmission(form.id, data, ip);

  // Fire n8n webhook if configured
  if (form.webhook_url) {
    const payload = {
      form_id: form.id,
      form_name: form.name,
      submitted_at: new Date().toISOString(),
      fields: data,
    };

    // Fire-and-forget — don't block the response on n8n latency
    fetch(form.webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Swallow — submission is already saved, webhook failure is non-fatal
    });
  }

  return NextResponse.json({ ok: true });
}
