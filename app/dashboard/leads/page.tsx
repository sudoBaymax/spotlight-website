import { getActiveTenant } from "@/lib/effective-tenant";
import { getLeads } from "@/lib/n8n-reader";
import SampleDataBadge from "@/components/dashboard/SampleDataBadge";
import type { LeadRow } from "@/lib/types";

const PAGE_SIZE = 50;

const STATUS_COLORS: Record<string, string> = {
  booked: "text-green-400 bg-green-400/10",
  new: "text-blue-400 bg-blue-400/10",
  queued: "text-slate-400 bg-slate-400/10",
  no_answer_retry: "text-indigo-400 bg-indigo-400/10",
  human_task: "text-amber-400 bg-amber-400/10",
  suppressed: "text-red-400 bg-red-400/10",
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `<1h ago`;
}

const STATUSES = ["new", "queued", "no_answer_retry", "human_task", "booked", "suppressed"];
const INTENTS = ["buy", "sell", "invest", "rent", "other"];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; intent?: string };
}) {
  const { dataset } = await getActiveTenant();

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const filters: Record<string, string> = {};
  if (searchParams.status) filters.status = searchParams.status;
  if (searchParams.intent) filters.intent = searchParams.intent;

  let rows: LeadRow[] = [];
  let total = 0;
  let dataOrigin: "FAKE" | "REAL" = "FAKE";
  let error: string | null = null;

  try {
    const res = await getLeads(dataset, PAGE_SIZE, offset, filters);
    rows = res.rows;
    total = res.total;
    dataOrigin = res.data_origin;
  } catch (e: any) {
    error = e.message;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const qs = (extra?: Record<string, string>) => {
    const p = { ...filters, ...extra };
    return Object.keys(p).length ? "?" + new URLSearchParams(p as any).toString() : "";
  };

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-white font-semibold text-[20px]">Leads</h1>
          <p className="text-[#555] text-[13px]">{total} total</p>
        </div>
        {dataOrigin === "FAKE" && <SampleDataBadge />}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          <span className="text-[#444] text-[11px] self-center uppercase tracking-wider">Status</span>
          <a href={`/dashboard/leads${qs({ intent: searchParams.intent ?? "" })}`}
            className={`px-3 py-1 rounded-full text-[12px] border transition-colors ${!searchParams.status ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#242424] text-[#555] hover:text-[#aaa]"}`}>All</a>
          {STATUSES.map(s => (
            <a key={s} href={`/dashboard/leads${qs({ status: s, intent: searchParams.intent ?? "" })}`}
              className={`px-3 py-1 rounded-full text-[12px] border transition-colors capitalize ${searchParams.status === s ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#242424] text-[#555] hover:text-[#aaa]"}`}>
              {s.replace(/_/g, " ")}
            </a>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-[#444] text-[11px] self-center uppercase tracking-wider">Intent</span>
          <a href={`/dashboard/leads${qs({ status: searchParams.status ?? "" })}`}
            className={`px-3 py-1 rounded-full text-[12px] border transition-colors ${!searchParams.intent ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#242424] text-[#555] hover:text-[#aaa]"}`}>All</a>
          {INTENTS.map(i => (
            <a key={i} href={`/dashboard/leads${qs({ status: searchParams.status ?? "", intent: i })}`}
              className={`px-3 py-1 rounded-full text-[12px] border transition-colors capitalize ${searchParams.intent === i ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#242424] text-[#555] hover:text-[#aaa]"}`}>
              {i}
            </a>
          ))}
        </div>
      </div>

      {error ? (
        <div className="bg-[#141414] border border-[#FF2D1A]/20 rounded-xl p-5">
          <p className="text-[#FF2D1A] text-[13px]">{error}</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#242424] rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1a1a1a] text-[#444] text-[11px] uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Contact</th>
                <th className="text-left px-4 py-3 font-medium">Intent</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Attempts</th>
                <th className="text-right px-4 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#444]">No leads found.</td>
                </tr>
              ) : (
                rows.map((lead) => (
                  <tr key={lead.lead_id} className="hover:bg-[#181818] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#ccc]">{lead.name}</p>
                      <p className="text-[#3a3a3a] text-[11px] mt-0.5 truncate max-w-[180px]">{lead.inquiry_topic}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#666] text-[12px]">{lead.phone}</p>
                      <p className="text-[#444] text-[11px] mt-0.5 truncate max-w-[160px]">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#777] capitalize">{lead.intent}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_COLORS[lead.status] ?? "text-slate-400 bg-slate-400/10"}`}>
                        {lead.status.replace(/_/g, " ")}
                      </span>
                      {lead.suppression_flag && (
                        <span className="block text-[10px] text-[#FF2D1A] mt-0.5">{lead.suppression_flag}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#555]">{lead.attempts}</td>
                    <td className="px-4 py-3 text-right text-[#444]">{relativeTime(lead.submitted_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#1a1a1a]">
              <p className="text-[#555] text-[12px]">Page {page} of {totalPages} · {total} leads</p>
              <div className="flex gap-2">
                {page > 1 && <a href={`/dashboard/leads?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ""}${searchParams.intent ? `&intent=${searchParams.intent}` : ""}`} className="px-3 py-1.5 text-[12px] border border-[#242424] rounded-lg text-[#666] hover:text-[#ccc] transition-colors">← Prev</a>}
                {page < totalPages && <a href={`/dashboard/leads?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ""}${searchParams.intent ? `&intent=${searchParams.intent}` : ""}`} className="px-3 py-1.5 text-[12px] border border-[#242424] rounded-lg text-[#666] hover:text-[#ccc] transition-colors">Next →</a>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
