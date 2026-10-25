import bcrypt from "bcryptjs";
import crypto from "crypto";
import sql from "./db";

export interface Tenant {
  id: string;
  username: string;
  password_hash: string;
  label: string;
  description: string;
  table_prefix: string;
  dataset: "demo" | "live";
  role: "superadmin" | "client";
  active: boolean;
  mfa_enabled: boolean;
  mfa_secret: string | null;
  byok: {
    openai_key: string | null;
    twilio_sid: string | null;
    twilio_token: string | null;
    sendgrid_key: string | null;
  };
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export type TenantPublic = Omit<Tenant, "password_hash" | "mfa_secret">;

function toPublic(row: any): TenantPublic {
  return {
    id: row.id,
    username: row.username,
    label: row.label,
    description: row.description ?? "",
    table_prefix: row.table_prefix,
    dataset: row.dataset,
    role: row.role,
    active: row.active,
    mfa_enabled: row.mfa_enabled ?? false,
    byok: row.byok ?? { openai_key: null, twilio_sid: null, twilio_token: null, sendgrid_key: null },
    contact_email: row.contact_email ?? null,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}

export async function getTenantByUsername(username: string): Promise<Tenant | null> {
  const rows = await sql`
    SELECT * FROM tenants WHERE username = ${username} AND active = true LIMIT 1
  `;
  if (!rows[0]) return null;
  return rows[0] as Tenant;
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const rows = await sql`
    SELECT * FROM tenants WHERE id = ${id} LIMIT 1
  `;
  if (!rows[0]) return null;
  return rows[0] as Tenant;
}

export async function getAllTenants(): Promise<TenantPublic[]> {
  const rows = await sql`
    SELECT id, username, label, description, table_prefix, dataset, role, active,
           mfa_enabled, byok, contact_email, created_at, updated_at
    FROM tenants ORDER BY created_at ASC
  `;
  return rows.map(toPublic);
}

export interface CreateTenantInput {
  label: string;
  description?: string;
  username: string;
  password: string;
  table_prefix: string;
  dataset: "demo" | "live";
  contact_email?: string;
}

export async function createTenant(
  input: CreateTenantInput
): Promise<{ tenant: TenantPublic }> {
  const slug = input.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const password_hash = await bcrypt.hash(input.password, 12);

  const rows = await sql`
    INSERT INTO tenants (
      id, username, password_hash, label, description, table_prefix,
      dataset, role, active, mfa_enabled, mfa_secret, byok, contact_email
    ) VALUES (
      ${slug},
      ${input.username},
      ${password_hash},
      ${input.label},
      ${input.description ?? ""},
      ${input.table_prefix},
      ${input.dataset},
      'client',
      true,
      false,
      null,
      ${{ openai_key: null, twilio_sid: null, twilio_token: null, sendgrid_key: null }},
      ${input.contact_email ?? null}
    )
    RETURNING id, username, label, description, table_prefix, dataset, role, active,
              mfa_enabled, byok, contact_email, created_at, updated_at
  `;

  return { tenant: toPublic(rows[0]) };
}

export async function updateTenant(
  id: string,
  updates: Partial<Pick<Tenant, "label" | "description" | "active" | "contact_email" | "byok">>
): Promise<TenantPublic> {
  const rows = await sql`
    UPDATE tenants SET
      label        = COALESCE(${updates.label ?? null}, label),
      description  = COALESCE(${updates.description ?? null}, description),
      active       = COALESCE(${updates.active ?? null}, active),
      contact_email= COALESCE(${updates.contact_email ?? null}, contact_email),
      byok         = COALESCE(${updates.byok ? JSON.stringify(updates.byok) : null}::jsonb, byok),
      updated_at   = NOW()
    WHERE id = ${id}
    RETURNING id, username, label, description, table_prefix, dataset, role, active,
              mfa_enabled, byok, contact_email, created_at, updated_at
  `;
  if (!rows[0]) throw new Error(`Tenant "${id}" not found`);
  return toPublic(rows[0]);
}

export async function resetTenantPassword(id: string): Promise<string> {
  const newPassword = crypto.randomBytes(14).toString("base64url");
  const hash = await bcrypt.hash(newPassword, 12);
  await sql`
    UPDATE tenants SET password_hash = ${hash}, updated_at = NOW() WHERE id = ${id}
  `;
  return newPassword;
}

export async function setTenantPasswordHash(id: string, hash: string): Promise<void> {
  await sql`
    UPDATE tenants SET password_hash = ${hash}, updated_at = NOW() WHERE id = ${id}
  `;
}

/** Generate a secure random password for a new tenant */
export function generatePassword(): string {
  return crypto.randomBytes(14).toString("base64url");
}
