import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { getAllTenants, createTenant, generatePassword, getTenantById } from "@/lib/tenants";

function isSuperadmin(session: any): boolean {
  return session?.user?.role === "superadmin";
}

// GET /api/admin/tenants — list all tenants
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isSuperadmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ tenants: await getAllTenants() });
}

// POST /api/admin/tenants — create a new tenant
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isSuperadmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { label, description, username, table_prefix, dataset, contact_email, admin_password } = body;

  if (!label || !username || !table_prefix || !dataset || !admin_password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify admin's own password before creating a tenant
  const admin = await getTenantById((session as any).user.tenant_id);
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 403 });

  const passwordOk = await bcrypt.compare(admin_password, admin.password_hash);
  if (!passwordOk) return NextResponse.json({ error: "Incorrect admin password" }, { status: 403 });

  const generated_password = generatePassword();

  try {
    const result = await createTenant({
      label,
      description: description ?? "",
      username,
      password: generated_password,
      table_prefix,
      dataset,
      contact_email: contact_email ?? undefined,
    });

    return NextResponse.json({
      tenant: result.tenant,
      credentials: {
        username,
        password: generated_password,
        note: "Save this password — it will not be shown again.",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
