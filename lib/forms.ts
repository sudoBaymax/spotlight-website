import sql from "./db";

export type FieldType = "text" | "email" | "tel" | "select" | "textarea" | "checkbox";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select fields only
}

export interface FormStyles {
  primaryColor: string;
  buttonText: string;
  successMessage: string;
}

export interface Form {
  id: string;
  tenant_id: string;
  name: string;
  fields: FormField[];
  webhook_url: string | null;
  styles: FormStyles;
  active: boolean;
  created_at: string;
}

export const DEFAULT_STYLES: FormStyles = {
  primaryColor: "#FF2D1A",
  buttonText: "Get a Free Quote",
  successMessage: "Thanks! We'll call you within 60 seconds.",
};

const DEFAULT_FIELDS: FormField[] = [
  { id: "field_name", type: "text", label: "Full Name", placeholder: "John Smith", required: true },
  { id: "field_phone", type: "tel", label: "Phone Number", placeholder: "(555) 555-5555", required: true },
  { id: "field_email", type: "email", label: "Email Address", placeholder: "john@example.com", required: false },
];

function toForm(row: any): Form {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    name: row.name,
    fields: row.fields ?? [],
    webhook_url: row.webhook_url ?? null,
    styles: { ...DEFAULT_STYLES, ...(row.styles ?? {}) },
    active: row.active,
    created_at: row.created_at,
  };
}

export async function getFormsByTenant(tenant_id: string): Promise<Form[]> {
  const rows = await sql`
    SELECT * FROM forms
    WHERE tenant_id = ${tenant_id}
    ORDER BY created_at DESC
  `;
  return rows.map(toForm);
}

export async function getFormById(id: string): Promise<Form | null> {
  const rows = await sql`SELECT * FROM forms WHERE id = ${id}`;
  return rows[0] ? toForm(rows[0]) : null;
}

export async function createForm(tenant_id: string, name: string): Promise<Form> {
  const rows = await sql`
    INSERT INTO forms (id, tenant_id, name, fields, styles)
    VALUES (
      gen_random_uuid()::TEXT,
      ${tenant_id},
      ${name},
      ${JSON.stringify(DEFAULT_FIELDS)}::jsonb,
      ${JSON.stringify(DEFAULT_STYLES)}::jsonb
    )
    RETURNING *
  `;
  return toForm(rows[0]);
}

export async function updateForm(
  id: string,
  patch: {
    name?: string;
    fields?: FormField[];
    webhook_url?: string | null;
    styles?: Partial<FormStyles>;
    active?: boolean;
  },
): Promise<Form | null> {
  const current = await getFormById(id);
  if (!current) return null;

  const name = patch.name ?? current.name;
  const fields = patch.fields ?? current.fields;
  const webhook_url = patch.webhook_url !== undefined ? patch.webhook_url : current.webhook_url;
  const styles = { ...current.styles, ...(patch.styles ?? {}) };
  const active = patch.active !== undefined ? patch.active : current.active;

  const rows = await sql`
    UPDATE forms SET
      name        = ${name},
      fields      = ${JSON.stringify(fields)}::jsonb,
      webhook_url = ${webhook_url},
      styles      = ${JSON.stringify(styles)}::jsonb,
      active      = ${active}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? toForm(rows[0]) : null;
}

export async function deleteForm(id: string): Promise<void> {
  await sql`DELETE FROM forms WHERE id = ${id}`;
}

export async function logSubmission(
  form_id: string,
  data: Record<string, string>,
  ip: string | null,
): Promise<void> {
  await sql`
    INSERT INTO form_submissions (id, form_id, data, ip)
    VALUES (gen_random_uuid()::TEXT, ${form_id}, ${JSON.stringify(data)}::jsonb, ${ip})
  `;
}
