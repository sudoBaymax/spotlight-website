import { notFound } from "next/navigation";
import { getFormById } from "@/lib/forms";
import PublicForm from "@/components/forms/PublicForm";

export const dynamic = "force-dynamic";

export default async function EmbedFormPage({ params }: { params: { id: string } }) {
  const form = await getFormById(params.id);
  if (!form || !form.active) notFound();
  return <PublicForm form={form} />;
}
