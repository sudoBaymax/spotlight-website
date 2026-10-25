import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { getTenantById, updateTenant } from "@/lib/tenants";

// PATCH /api/settings/byok — client updates their own API keys
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const body = await req.json();
  const { password, openai_key, twilio_sid, twilio_token, sendgrid_key } = body;

  if (!password) {
    return NextResponse.json({ error: "Password is required to save changes" }, { status: 400 });
  }

  const tenant = await getTenantById(user.tenant_id);
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  const passwordOk = await bcrypt.compare(password, tenant.password_hash);
  if (!passwordOk) return NextResponse.json({ error: "Incorrect password" }, { status: 403 });

  const byok = {
    openai_key: openai_key?.trim() || null,
    twilio_sid: twilio_sid?.trim() || null,
    twilio_token: twilio_token?.trim() || null,
    sendgrid_key: sendgrid_key?.trim() || null,
  };

  const updated = await updateTenant(user.tenant_id, { byok });
  return NextResponse.json({ byok: updated.byok });
}

// GET /api/settings/byok — returns which keys are set (boolean only, never the values)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const tenant = await getTenantById(user.tenant_id);
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  return NextResponse.json({
    byok: {
      openai_key: !!tenant.byok.openai_key,
      twilio_sid: !!tenant.byok.twilio_sid,
      twilio_token: !!tenant.byok.twilio_token,
      sendgrid_key: !!tenant.byok.sendgrid_key,
    },
  });
}
