import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getActiveTenant } from "@/lib/effective-tenant";
import { getFormsByTenant } from "@/lib/forms";
import type { Form } from "@/lib/forms";

function FormCard({ form }: { form: Form }) {
  const fieldCount = form.fields.length;
  const hasWebhook = !!form.webhook_url;

  return (
    <div className="bg-[#141414] border border-[#242424] rounded-xl p-5 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <h3 className="text-white font-semibold text-[14px] truncate">{form.name}</h3>
          {!form.active && (
            <span className="text-[10px] font-medium text-[#555] bg-[#1a1a1a] border border-[#2a2a2a] rounded px-1.5 py-0.5">
              inactive
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[12px] text-[#555]">
          <span>{fieldCount} field{fieldCount !== 1 ? "s" : ""}</span>
          <span>·</span>
          {hasWebhook ? (
            <span className="text-green-500/70">webhook connected</span>
          ) : (
            <span className="text-amber-500/70">no webhook</span>
          )}
        </div>
      </div>

      <Link
        href={`/dashboard/forms/${form.id}`}
        className="flex-shrink-0 px-3.5 py-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-[#ccc] text-[12px] font-medium rounded-lg transition-colors"
      >
        Edit →
      </Link>
    </div>
  );
}

export default async function FormsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenant = await getActiveTenant();
  const forms = await getFormsByTenant(tenant.tenant_id);

  return (
    <div className="p-6 max-w-[640px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-semibold text-[20px]">Forms</h1>
          <p className="text-[#555] text-[13px] mt-0.5">
            Build lead capture forms that trigger your voice bot instantly.
          </p>
        </div>
        <Link
          href="/dashboard/forms/new"
          className="px-4 py-2 bg-[#FF2D1A] hover:bg-[#e02718] text-white text-[13px] font-semibold rounded-lg transition-colors"
        >
          + New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-8 text-center">
          <p className="text-[#555] text-[14px] mb-1">No forms yet</p>
          <p className="text-[#3a3a3a] text-[12px] mb-5">
            Create your first form to start capturing leads from your website.
          </p>
          <Link
            href="/dashboard/forms/new"
            className="inline-flex px-4 py-2 bg-[#FF2D1A] hover:bg-[#e02718] text-white text-[13px] font-semibold rounded-lg transition-colors"
          >
            Create a form
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
}
