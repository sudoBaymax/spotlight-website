import { getActiveTenant } from "@/lib/effective-tenant";
import { getAlerts } from "@/lib/n8n-reader";
import SampleDataBadge from "@/components/dashboard/SampleDataBadge";
import type { AlertRow } from "@/lib/types";

const PAGE_SIZE = 50;

const SEVERITY_STYLES: Record<string, string> = {
  high: "text-[#FF2D1A] bg-[#FF2D1A]/10 border-[#FF2D1A]/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const TYPE_LABELS: Record<string, string> = {
  compliance: "Compliance",
  dnc: "DNC",
  consent: "Consent",
  call_length: "Call length",
  repeated_contact: "Repeated contact",
  other: "Other",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "<1h ago";
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: { page?: string; severity?: string };
}) {
  const { dataset } = await getActiveTenant();

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  let rows: AlertRow[] = [];
  let total = 0;
  let dataOrigin: "FAKE" | "REAL" = "FAKE";
  let error: string | null = null;

  try {
    const res = await getAlerts(dataset, PAGE_SIZE, offset);
    rows = res.rows;
    total = res.total;
    dataOrigin = res.data_origin;
  } catch (e: any) {
    error = e.message;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const severityFilter = searchParams.severity as "high" | "medium" | undefined;
  const filtered = severityFilter ? rows.filter((r) => r.severity === severityFilter) : rows;

  const openCount = rows.filter((r) => !r.resolved_at).length;
  const highCount = rows.filter((r) => r.severity === "high" && !r.resolved_at).length;

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-white font-semibold text-[20px]">Compliance Alerts</h1>
          <p className="text-[#555] text-[13px]">
            {openCount} open
            {highCount > 0 && (
              <span className="text-[#FF2D1A] ml-1">· {highCount} high severity</span>
            )}
          </p>
        </div>
        {dataOrigin === "FAKE" && <SampleDataBadge />}
      </div>

      {/* Severity filters */}
      <div className="flex gap-2 mb-5">
        <a
          href="/dashboard/alerts"
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
            !severityFilter
              ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]"
              : "border-[#242424] text-[#555] hover:text-[#aaa]"
          }`}
        >
          All
        </a>
        <a
          href="/dashboard/alerts?severity=high"
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
            severityFilter === "high"
              ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]"
              : "border-[#242424] text-[#555] hover:text-[#aaa]"
          }`}
        >
          High
        </a>
        <a
          href="/dashboard/alerts?severity=medium"
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
            severityFilter === "medium"
              ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]"
              : "border-[#242424] text-[#555] hover:text-[#aaa]"
          }`}
        >
          Medium
        </a>
      </div>

      {error ? (
        <div className="bg-[#141414] border border-[#FF2D1A]/20 rounded-xl p-5">
          <p className="text-[#FF2D1A] font-semibold text-[13px] mb-1">
            {error.includes("warming up") ? "n8n is warming up" : "Reader error"}
          </p>
          <p className="text-[#555] text-[12px]">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-10 text-center">
          <p className="text-[#444] text-[13px]">
            {openCount === 0 ? "No compliance alerts — all clear." : "No alerts match this filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((alert) => {
            const resolved = !!alert.resolved_at;
            return (
              <div
                key={alert.call_id + alert.alert_created_at}
                className={`bg-[#141414] border rounded-xl px-5 py-4 ${
                  resolved
                    ? "border-[#1a1a1a] opacity-60"
                    : alert.severity === "high"
                    ? "border-[#FF2D1A]/20"
                    : "border-amber-400/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          SEVERITY_STYLES[alert.severity] ?? "text-slate-400 bg-slate-400/10 border-slate-400/20"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[#555] text-[11px] capitalize">
                        {TYPE_LABELS[alert.type] ?? alert.type}
                      </span>
                      {resolved && (
                        <span className="text-green-400 text-[10px] font-semibold">
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-[#aaa] text-[13px] leading-relaxed">{alert.detail}</p>
                    <p className="text-[#3a3a3a] text-[11px] mt-2 font-mono">
                      call: {alert.call_id}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <p className="text-[#555] text-[12px]">{timeAgo(alert.alert_created_at)}</p>
                    {resolved && alert.resolved_at && (
                      <p className="text-[#3a3a3a] text-[11px]">
                        resolved {timeAgo(alert.resolved_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-[#555] text-[12px]">
                Page {page} of {totalPages} · {total} alerts
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`/dashboard/alerts?page=${page - 1}${severityFilter ? `&severity=${severityFilter}` : ""}`}
                    className="px-3 py-1.5 text-[12px] border border-[#242424] rounded-lg text-[#666] hover:text-[#ccc] transition-colors"
                  >
                    ← Prev
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={`/dashboard/alerts?page=${page + 1}${severityFilter ? `&severity=${severityFilter}` : ""}`}
                    className="px-3 py-1.5 text-[12px] border border-[#242424] rounded-lg text-[#666] hover:text-[#ccc] transition-colors"
                  >
                    Next →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
