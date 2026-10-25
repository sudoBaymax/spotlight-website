import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActiveTenant } from "@/lib/effective-tenant";
import { createForm } from "@/lib/forms";

export default async function NewFormPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenant = await getActiveTenant();
  const form = await createForm(tenant.tenant_id, "Untitled Form");
  redirect(`/dashboard/forms/${form.id}`);
}
