import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getTenantById } from "@/lib/tenants";

/**
 * GET /api/admin/impersonate?as=<tenantId>
 *   → Sets spotlight_viewing_as cookie and redirects to /dashboard
 *
 * GET /api/admin/impersonate  (no ?as)
 *   → Clears the cookie and redirects to /dashboard/admin
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Only superadmins can impersonate
  if (!session || (session.user as any).role !== "superadmin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const as = req.nextUrl.searchParams.get("as");

  // No ?as = exit impersonation
  if (!as) {
    const res = NextResponse.redirect(new URL("/dashboard/admin", req.url));
    res.cookies.delete("spotlight_viewing_as");
    return res;
  }

  // Validate the target tenant exists and is active
  const tenant = await getTenantById(as);
  if (!tenant || !tenant.active) {
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  }

  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set("spotlight_viewing_as", as, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // No maxAge — expires when the browser session ends
  });
  return res;
}
