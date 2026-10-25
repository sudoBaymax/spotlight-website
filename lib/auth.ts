import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getTenantByUsername } from "./tenants";

// In-memory rate limiter: 5 failed attempts per username per 15-minute window.
// Resets on successful login. Works for single-instance (local + single Vercel
// function); good enough to stop naive brute-force — not a replacement for IP-
// level blocking at the edge.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(username: string): boolean {
  const now = Date.now();
  const key = username.toLowerCase();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function clearRateLimit(username: string) {
  loginAttempts.delete(username.toLowerCase());
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Rate-limit before touching the DB — same generic null return as a
        // wrong password so the caller can't distinguish the two.
        if (isRateLimited(credentials.username)) return null;

        // Look up tenant in registry — no hardcoded credentials
        const tenant = await getTenantByUsername(credentials.username);
        if (!tenant) return null;

        const passwordOk = await bcrypt.compare(credentials.password, tenant.password_hash);
        if (!passwordOk) return null;

        clearRateLimit(credentials.username);

        return {
          id: tenant.id,
          name: tenant.label,
          tenant_id: tenant.id,
          dataset: tenant.dataset,
          table_prefix: tenant.table_prefix,
          role: tenant.role,
          label: tenant.label,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.tenant_id = (user as any).tenant_id;
        token.dataset = (user as any).dataset;
        token.table_prefix = (user as any).table_prefix;
        token.role = (user as any).role;
        token.label = (user as any).label;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).tenant_id = token.tenant_id;
        (session.user as any).dataset = token.dataset;
        (session.user as any).table_prefix = token.table_prefix;
        (session.user as any).role = token.role;
        (session.user as any).label = token.label;
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
