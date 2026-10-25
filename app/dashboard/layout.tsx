import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getActiveTenant } from "@/lib/effective-tenant";
import Sidebar from "@/components/dashboard/Sidebar";
import { getFollowUps } from "@/lib/n8n-reader";

export const metadata = { title: "Dashboard — Spotlight" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenant = await getActiveTenant();

  // Pending approvals badge uses the effective tenant's dataset
  let pendingApprovals = 0;
  try {
    const fu = await getFollowUps(tenant.dataset, 1, 0, { status: "pending_approval" });
    pendingApprovals = fu.total;
  } catch {
    // reader not published yet or other error — badge shows 0
  }

  return (
    <div className="flex min-h-screen bg-[#0C0C0C]">
      <Sidebar
        pendingApprovals={pendingApprovals}
        role={tenant.session_role}
        label={tenant.label}
        impersonating={tenant.impersonating ? { label: tenant.impersonated_label! } : undefined}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
