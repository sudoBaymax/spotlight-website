/**
 * Password hash generator — run once to create ADMIN_PASSWORD_HASH
 * Usage: node scripts/gen-hash.mjs
 */
import bcrypt from "bcryptjs";
import { createInterface } from "readline";

const rl = createInterface({ input: process.stdin, output: process.stdout });

// Hide typed characters
if (process.stdin.isTTY) process.stdin.setRawMode(true);

rl.question("Enter password to hash: ", async (pwd) => {
  if (!pwd) {
    console.error("No password entered.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(pwd, 12);
  console.log("\n── Copy this into your .env as ADMIN_PASSWORD_HASH ──");
  console.log(hash);
  console.log("─────────────────────────────────────────────────────");
  rl.close();
});
