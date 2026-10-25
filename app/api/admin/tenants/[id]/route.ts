import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { getTenantById, updateTenant, resetTenantPassword } from "@/lib/tenants";

function isSuperadmin(session: any): boolean {
  return session?.user?.role === "superadmin";
}

// GET /api/admin/tenants/[id] — fetch single tenant (superadmin only)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isSuperadmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const tenant = await getTenantById(params.id);
  if (!tenant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { password_hash, mfa_secret, ...pub } = tenant;
  return NextResponse.json({ tenant: pub });
}

// PATCH /api/admin/tenants/[id] — update label, description, active, byok, contact_email
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isSuperadmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { action, admin_password, ...updates } = body;

  // All mutating actions require admin password re-confirmation
  const admin = await getTenantById((session as any).user.tenant_id);
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 403 });
  const passwordOk = await bcrypt.compare(admin_password, admin.password_hash);
  if (!passwordOk) return NextResponse.json({ error: "Incorrect admin password" }, { status: 403 });

  try {
    if (action === "reset_password") {
      const newPassword = await resetTenantPassword(params.id);
      return NextResponse.json({
        message: "Password reset",
        credentials: {
          password: newPassword,
          note: "Save this password — it will not be shown again.",
        },
      });
    }

    if (action === "deactivate") {
      const tenant = await updateTenant(params.id, { active: false });
      return NextResponse.json({ tenant });
    }

    if (action === "activate") {
      const tenant = await updateTenant(params.id, { active: true });
      return NextResponse.json({ tenant });
    }

    // General update
    const allowed = ["label", "description", "active", "contact_email", "byok"];
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );
    const tenant = await updateTenant(params.id, filtered as any);
    return NextResponse.json({ tenant });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
