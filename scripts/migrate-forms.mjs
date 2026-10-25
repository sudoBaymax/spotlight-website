import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency required)
const envPath = resolve(__dirname, "../.env");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !key.startsWith("#")) {
      const raw = rest.join("=").trim();
      // Strip surrounding quotes added by vercel env pull
      const val = raw.replace(/^["']|["']$/g, "");
      process.env[key.trim()] ??= val;
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set in .env");
  process.exit(1);
}

// Neon HTTP driver doesn't support channel_binding — strip it
const rawUrl = new URL(process.env.DATABASE_URL);
rawUrl.searchParams.delete("channel_binding");
const sql = neon(rawUrl.toString());

async function migrate() {
  console.log("Creating forms tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS forms (
      id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      tenant_id   TEXT        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      name        TEXT        NOT NULL,
      fields      JSONB       NOT NULL DEFAULT '[]',
      webhook_url TEXT,
      styles      JSONB       NOT NULL DEFAULT '{}',
      active      BOOLEAN     NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id           TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      form_id      TEXT        NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
      data         JSONB       NOT NULL DEFAULT '{}',
      ip           TEXT,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("✓ forms table ready");
  console.log("✓ form_submissions table ready");
  console.log("Migration complete.");
}

migrate().catch((e) => { console.error(e); process.exit(1); });
