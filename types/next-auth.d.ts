import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tenant_id: string;
      dataset: "demo" | "live";
      table_prefix: string;
      role: "superadmin" | "client";
      label: string;
    };
  }
  interface User {
    tenant_id: string;
    dataset: "demo" | "live";
    table_prefix: string;
    role: "superadmin" | "client";
    label: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenant_id: string;
    dataset: "demo" | "live";
    table_prefix: string;
    role: "superadmin" | "client";
    label: string;
  }
}
