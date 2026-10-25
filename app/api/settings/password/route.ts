import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { getTenantById, setTenantPasswordHash } from "@/lib/tenants";

// PATCH /api/settings/password
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const body = await req.json();
  const { current_password, new_password } = body;

  if (!current_password || !new_password) {
    return NextResponse.json({ error: "Both current and new password are required" }, { status: 400 });
  }

  if (new_password.length < 12) {
    return NextResponse.json({ error: "New password must be at least 12 characters" }, { status: 400 });
  }

  const tenant = await getTenantById(user.tenant_id);
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  const currentOk = await bcrypt.compare(current_password, tenant.password_hash);
  if (!currentOk) return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });

  if (current_password === new_password) {
    return NextResponse.json({ error: "New password must differ from current password" }, { status: 400 });
  }

  const new_hash = await bcrypt.hash(new_password, 12);
  await setTenantPasswordHash(user.tenant_id, new_hash);

  return NextResponse.json({ ok: true });
}
