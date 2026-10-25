/**
 * One-time migration: creates the tenants table in Neon and imports
 * any existing tenants from data/tenants.json.
 *
 * Usage:
 *   node scripts/migrate.mjs
 *
 * Requires DATABASE_URL to be set in .env
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Load .env manually (Node doesn't auto-load it)
const envPath = resolve(root, ".env");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !key.startsWith("#")) {
      process.env[key.trim()] ??= rest.join("=").trim();
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set in .env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Creating tenants table...");

  await sql`
    CREATE TABLE IF NOT EXISTS tenants (
      id            TEXT        PRIMARY KEY,
      username      TEXT        UNIQUE NOT NULL,
      password_hash TEXT        NOT NULL,
      label         TEXT        NOT NULL,
      description   TEXT        NOT NULL DEFAULT '',
      table_prefix  TEXT        NOT NULL DEFAULT '',
      dataset       TEXT        NOT NULL DEFAULT 'demo'
                                CHECK (dataset IN ('demo', 'live')),
      role          TEXT        NOT NULL DEFAULT 'client'
                                CHECK (role IN ('superadmin', 'client')),
      active        BOOLEAN     NOT NULL DEFAULT true,
      mfa_enabled   BOOLEAN     NOT NULL DEFAULT false,
      mfa_secret    TEXT,
      byok          JSONB       NOT NULL DEFAULT '{"openai_key":null,"twilio_sid":null,"twilio_token":null,"sendgrid_key":null}',
      contact_email TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("  ✓ tenants table ready");

  // Migrate existing JSON data if present
  const jsonPath = resolve(root, "data", "tenants.json");
  if (!existsSync(jsonPath)) {
    console.log("  No data/tenants.json found — skipping seed.");
    return;
  }

  const { tenants } = JSON.parse(readFileSync(jsonPath, "utf-8"));
  console.log(`  Migrating ${tenants.length} tenant(s) from tenants.json...`);

  for (const t of tenants) {
    const byok = t.byok ?? { openai_key: null, twilio_sid: null, twilio_token: null, sendgrid_key: null };
    await sql`
      INSERT INTO tenants (
        id, username, password_hash, label, description, table_prefix,
        dataset, role, active, mfa_enabled, mfa_secret, byok, contact_email,
        created_at, updated_at
      ) VALUES (
        ${t.id},
        ${t.username},
        ${t.password_hash},
        ${t.label},
        ${t.description ?? ""},
        ${t.table_prefix ?? ""},
        ${t.dataset ?? "demo"},
        ${t.role ?? "client"},
        ${t.active ?? true},
        ${t.mfa_enabled ?? false},
        ${t.mfa_secret ?? null},
        ${JSON.stringify(byok)},
        ${t.contact_email ?? null},
        ${t.created_at ?? new Date().toISOString()},
        ${t.updated_at ?? new Date().toISOString()}
      )
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`    ✓ ${t.label} (${t.id})`);
  }

  console.log("\nMigration complete.");
}

main().catch((e) => {
  console.error("Migration failed:", e.message);
  process.exit(1);
});
