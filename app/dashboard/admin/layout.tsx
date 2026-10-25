import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";

// Guard all /dashboard/admin/* routes:
// - Must be superadmin
// - Must not be impersonating (exit first, then return here)
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "superadmin") redirect("/dashboard");
  if (cookies().get("spotlight_viewing_as")?.value) redirect("/dashboard");

  return <>{children}</>;
}
