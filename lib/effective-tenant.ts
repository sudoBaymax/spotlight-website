import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "./auth";
import { getTenantById } from "./tenants";
import type { Dataset } from "./types";

export interface ActiveTenant {
  /** Effective tenant data — changes when superadmin is impersonating */
  tenant_id: string;
  label: string;
  /** Passed server-side to the n8n reader. Never accepted from the browser. */
  dataset: Dataset;
  /** Display only — never sent to the n8n reader. Reader uses dataset only. */
  table_prefix: string;
  role: "superadmin" | "client";

  /** Always the real logged-in user's role — used for nav/permissions */
  session_role: "superadmin" | "client";

  /** True when superadmin is viewing as another tenant */
  impersonating: boolean;
  impersonated_label?: string;
}

/**
 * Resolves the effective tenant for the current request.
 *
 * - For regular clients: returns their own session tenant data.
 * - For superadmins with `spotlight_viewing_as` cookie set: returns that
 *   tenant's dataset so data fetches use the correct n8n tables.
 * - Falls back to the session tenant if the cookie is stale or tenant inactive.
 */
export async function getActiveTenant(): Promise<ActiveTenant> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  const user = session.user as any;
  const sessionRole = user.role as "superadmin" | "client";

  if (sessionRole === "superadmin") {
    const cookieStore = cookies();
    const viewingAs = cookieStore.get("spotlight_viewing_as")?.value;

    if (viewingAs) {
      const tenant = await getTenantById(viewingAs);
      if (tenant && tenant.active) {
        return {
          tenant_id: tenant.id,
          label: tenant.label,
          dataset: tenant.dataset,
          table_prefix: tenant.table_prefix,
          role: tenant.role,
          session_role: sessionRole,
          impersonating: true,
          impersonated_label: tenant.label,
        };
      }
    }
  }

  return {
    tenant_id: user.tenant_id,
    label: user.label,
    dataset: user.dataset,
    table_prefix: user.table_prefix,
    role: sessionRole,
    session_role: sessionRole,
    impersonating: false,
  };
}
