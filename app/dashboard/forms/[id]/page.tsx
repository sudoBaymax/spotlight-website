import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActiveTenant } from "@/lib/effective-tenant";
import { getFormById } from "@/lib/forms";
import FormBuilder from "@/components/forms/FormBuilder";

export const dynamic = "force-dynamic";

export default async function FormBuilderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenant = await getActiveTenant();
  const form = await getFormById(params.id);

  if (!form || form.tenant_id !== tenant.tenant_id) notFound();

  return <FormBuilder initialForm={form} />;
}
