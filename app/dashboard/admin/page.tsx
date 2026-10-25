import { getAllTenants } from "@/lib/tenants";
import Link from "next/link";

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${active ? "bg-green-400" : "bg-[#3a3a3a]"}`} />
  );
}

export default async function AdminPage() {
  // Auth + impersonation guard handled by app/dashboard/admin/layout.tsx

  const tenants = await getAllTenants();

  return (
    <div className="p-6 max-w-[900px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium mb-1">Superadmin</p>
          <h1 className="text-white font-semibold text-[22px]">Tenant Management</h1>
          <p className="text-[#555] text-[13px] mt-1">{tenants.length} tenant{tenants.length !== 1 ? "s" : ""} registered</p>
        </div>
        <Link
          href="/dashboard/admin/tenants/new"
          className="inline-flex items-center gap-2 bg-[#FF2D1A] hover:bg-[#e02718] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 1v12M1 7h12" />
          </svg>
          Create tenant
        </Link>
      </div>

      {/* Tenant cards */}
      <div className="space-y-3">
        {tenants.map((t) => (
          <div key={t.id} className="bg-[#141414] border border-[#242424] rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <StatusDot active={t.active} />
                  <span className="text-white font-semibold text-[15px]">{t.label}</span>
                  {t.role === "superadmin" && (
                    <span className="bg-[#FF2D1A]/10 text-[#FF2D1A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Superadmin
                    </span>
                  )}
                  {t.dataset === "demo" && (
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Sample data
                    </span>
                  )}
                </div>
                {t.description && (
                  <p className="text-[#555] text-[12px] mb-3">{t.description}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <p className="text-[#3a3a3a] uppercase tracking-wider mb-0.5">ID</p>
                    <p className="text-[#666] font-mono">{t.id}</p>
                  </div>
                  <div>
                    <p className="text-[#3a3a3a] uppercase tracking-wider mb-0.5">Username</p>
                    <p className="text-[#666] font-mono truncate">{t.username}</p>
                  </div>
                  <div>
                    <p className="text-[#3a3a3a] uppercase tracking-wider mb-0.5">Table prefix</p>
                    <p className="text-[#666] font-mono">{t.table_prefix}</p>
                  </div>
                  <div>
                    <p className="text-[#3a3a3a] uppercase tracking-wider mb-0.5">Created</p>
                    <p className="text-[#666]">{new Date(t.created_at).toLocaleDateString("en-CA")}</p>
                  </div>
                </div>

                {/* BYOK status */}
                <div className="flex gap-2 mt-3">
                  {(["openai_key", "twilio_sid", "sendgrid_key"] as const).map((key) => (
                    <span key={key} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      t.byok[key]
                        ? "border-green-400/20 text-green-400 bg-green-400/5"
                        : "border-[#242424] text-[#3a3a3a]"
                    }`}>
                      {key.replace(/_key|_sid/, "").toUpperCase()} {t.byok[key] ? "✓" : "—"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link
                  href={`/api/admin/impersonate?as=${t.id}`}
                  className="text-[12px] px-3 py-1.5 border border-[#242424] rounded-lg text-[#888] hover:text-white hover:border-[#3a3a3a] transition-colors text-center"
                >
                  View dashboard →
                </Link>
                <Link
                  href={`/dashboard/admin/tenants/${t.id}`}
                  className="text-[12px] px-3 py-1.5 border border-[#242424] rounded-lg text-[#888] hover:text-white hover:border-[#3a3a3a] transition-colors text-center"
                >
                  Manage
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
