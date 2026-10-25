/**
 * Resets a tenant's password in the database.
 * Usage: node scripts/reset-password.mjs <username> <new-password>
 * Example: node scripts/reset-password.mjs josephjatouadminmanserver2341234hf myNewPassword
 */

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !key.startsWith("#")) {
      const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
      process.env[key.trim()] ??= val;
    }
  }
}

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage: node scripts/reset-password.mjs <username> <new-password>");
  process.exit(1);
}

const rawUrl = new URL(process.env.DATABASE_URL);
rawUrl.searchParams.delete("channel_binding");
const sql = neon(rawUrl.toString());

const hash = await bcrypt.hash(password, 12);
const rows = await sql`
  UPDATE tenants SET password_hash = ${hash} WHERE username = ${username} RETURNING id, username, label
`;

if (rows.length === 0) {
  console.error(`No tenant found with username: ${username}`);
  process.exit(1);
}

console.log(`✓ Password updated for ${rows[0].label} (${rows[0].username})`);
