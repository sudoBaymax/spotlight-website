import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — add it to .env");
}

// Single shared SQL client. Neon's HTTP driver is stateless and safe to
// reuse across serverless invocations.
const sql = neon(process.env.DATABASE_URL);

export default sql;
