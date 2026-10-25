import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — add it to .env");
}

// Neon's HTTP driver doesn't support the channel_binding parameter
// (it's a PostgreSQL wire-protocol option, irrelevant over HTTP).
// Strip it so the URL parses correctly in all environments.
const rawUrl = new URL(process.env.DATABASE_URL);
rawUrl.searchParams.delete("channel_binding");

const sql = neon(rawUrl.toString());

export default sql;
