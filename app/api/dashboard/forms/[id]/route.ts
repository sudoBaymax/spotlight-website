import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActiveTenant } from "@/lib/effective-tenant";
import { getFormById, updateForm, deleteForm } from "@/lib/forms";

async function verifyOwnership(formId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const tenant = await getActiveTenant();
  const form = await getFormById(formId);
  if (!form || form.tenant_id !== tenant.tenant_id) return null;
  return { form, tenant };
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await verifyOwnership(params.id);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.form);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await verifyOwnership(params.id);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const updated = await updateForm(params.id, {
    name: body.name,
    fields: body.fields,
    webhook_url: body.webhook_url,
    styles: body.styles,
    active: body.active,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await verifyOwnership(params.id);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteForm(params.id);
  return NextResponse.json({ ok: true });
}
