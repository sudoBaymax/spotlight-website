import { getActiveTenant } from "@/lib/effective-tenant";
import { getCalls } from "@/lib/n8n-reader";
import SampleDataBadge from "@/components/dashboard/SampleDataBadge";
import type { CallRow } from "@/lib/types";

const PAGE_SIZE = 50;

const OUTCOME_COLORS: Record<string, string> = {
  booked: "text-green-400 bg-green-400/10",
  no_answer: "text-blue-400 bg-blue-400/10",
  voicemail: "text-indigo-400 bg-indigo-400/10",
  not_interested: "text-amber-400 bg-amber-400/10",
  callback: "text-purple-400 bg-purple-400/10",
  wrong_number: "text-slate-400 bg-slate-400/10",
  dnc: "text-red-400 bg-red-400/10",
  other: "text-slate-400 bg-slate-400/10",
};

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `<1h ago`;
}

export default async function CallsPage({
  searchParams,
}: {
  searchParams: { page?: string; outcome?: string };
}) {
  const { dataset } = await getActiveTenant();

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;
  const outcomeFilter = searchParams.outcome;

  let rows: CallRow[] = [];
  let total = 0;
  let dataOrigin: "FAKE" | "REAL" = "FAKE";
  let error: string | null = null;

  try {
    const res = await getCalls(dataset, PAGE_SIZE, offset, outcomeFilter ? { outcome: outcomeFilter } : {});
    rows = res.rows;
    total = res.total;
    dataOrigin = res.data_origin;
  } catch (e: any) {
    error = e.message;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const OUTCOMES = ["booked", "no_answer", "voicemail", "not_interested", "callback", "wrong_number", "dnc", "other"];

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-white font-semibold text-[22px]">Calls</h1>
          <p className="text-[#999] text-[15px]">{total} total</p>
        </div>
        {dataOrigin === "FAKE" && <SampleDataBadge />}
      </div>

      {/* Outcome filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <a
          href="/dashboard/calls"
          className={`px-3 py-1.5 rounded-full text-[14px] font-medium border transition-colors ${
            !outcomeFilter
              ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]"
              : "border-[#383838] text-[#999] hover:text-[#ccc]"
          }`}
        >
          All
        </a>
        {OUTCOMES.map((o) => (
          <a
            key={o}
            href={`/dashboard/calls?outcome=${o}`}
            className={`px-3 py-1.5 rounded-full text-[14px] font-medium border transition-colors ${
              outcomeFilter === o
                ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]"
                : "border-[#383838] text-[#999] hover:text-[#ccc]"
            }`}
          >
            {o.replace(/_/g, " ")}
          </a>
        ))}
      </div>

      {error ? (
        <div className="bg-[#1c1c1c] border border-[#FF2D1A]/20 rounded-xl p-5">
          <p className="text-[#FF2D1A] font-semibold text-[15px] mb-1">
            {error?.includes("warming up") ? "n8n is warming up" : "Reader error"}
          </p>
          <p className="text-[#999] text-[14px]">{error}</p>
          {error?.includes("warming up") && (
            <p className="text-[#444] text-[14px] mt-2">Refresh the page in a moment — this only happens after a few minutes of inactivity.</p>
          )}
        </div>
      ) : (
        <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl overflow-hidden">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-[#444] text-[13px] uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Lead</th>
                <th className="text-left px-4 py-3 font-medium">Outcome</th>
                <th className="text-left px-4 py-3 font-medium">Direction</th>
                <th className="text-right px-4 py-3 font-medium">Duration</th>
                <th className="text-right px-4 py-3 font-medium">Cost</th>
                <th className="text-left px-4 py-3 font-medium">Flag</th>
                <th className="text-right px-4 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[#444] text-[15px]">
                    No calls found.
                  </td>
                </tr>
              ) : (
                rows.map((call) => (
                  <tr key={call.call_id} className="hover:bg-[#181818] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#ccc]">{call.lead_name ?? call.lead_id}</p>
                      {call.lead_phone && (
                        <p className="text-[#444] text-[13px] mt-0.5">{call.lead_phone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[13px] font-semibold capitalize ${
                          OUTCOME_COLORS[call.outcome] ?? "text-slate-400 bg-slate-400/10"
                        }`}
                      >
                        {call.outcome.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#aaa] capitalize">{call.direction}</td>
                    <td className="px-4 py-3 text-right text-[#bbb]">{fmt(call.duration_s)}</td>
                    <td className="px-4 py-3 text-right text-[#999]">${call.cost_usd.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {call.compliance_flag ? (
                        <span className="text-[#FF2D1A] text-[13px] font-semibold">⚠ Flag</span>
                      ) : (
                        <span className="text-[#2a2a2a]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#444]">{relativeTime(call.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
              <p className="text-[#999] text-[14px]">
                Page {page} of {totalPages} · {total} calls
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`/dashboard/calls?page=${page - 1}${outcomeFilter ? `&outcome=${outcomeFilter}` : ""}`}
                    className="px-3 py-1.5 text-[14px] border border-[#383838] rounded-lg text-[#aaa] hover:text-[#ccc] hover:border-[#3a3a3a] transition-colors"
                  >
                    ← Prev
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={`/dashboard/calls?page=${page + 1}${outcomeFilter ? `&outcome=${outcomeFilter}` : ""}`}
                    className="px-3 py-1.5 text-[14px] border border-[#383838] rounded-lg text-[#aaa] hover:text-[#ccc] hover:border-[#3a3a3a] transition-colors"
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
