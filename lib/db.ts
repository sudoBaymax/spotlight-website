import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — add it to .env");
}

// vercel env pull wraps values in quotes — strip them before parsing.
// Also strip channel_binding which isn't supported by Neon's HTTP driver.
const clean = process.env.DATABASE_URL.replace(/^["']|["']$/g, "");
const dbUrl = new URL(clean);
dbUrl.searchParams.delete("channel_binding");

const sql = neon(dbUrl.toString());

export default sql;
