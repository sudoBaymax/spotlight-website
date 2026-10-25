import { getActiveTenant } from "@/lib/effective-tenant";
import { getFollowUps } from "@/lib/n8n-reader";
import SampleDataBadge from "@/components/dashboard/SampleDataBadge";
import type { FollowUpRow } from "@/lib/types";

const PAGE_SIZE = 50;

const STAGE_COLORS: Record<string, string> = {
  follow_up: "text-blue-400 bg-blue-400/10",
  follow_through: "text-purple-400 bg-purple-400/10",
  follow_back: "text-amber-400 bg-amber-400/10",
};

const STATUS_COLORS: Record<string, string> = {
  pending_approval: "text-[#FF2D1A] bg-[#FF2D1A]/10",
  scheduled: "text-[#999] bg-[#242424]",
  sent: "text-green-400 bg-green-400/10",
  rejected: "text-red-400 bg-red-400/10",
};

const CHANNEL_ICONS: Record<string, string> = {
  email: "✉",
  sms: "💬",
  task: "☑",
};

function relativeTime(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const absDiff = Math.abs(diff);
  const h = Math.floor(absDiff / 3600000);
  const d = Math.floor(h / 24);
  const past = diff < 0;
  if (d > 0) return past ? `${d}d overdue` : `in ${d}d`;
  if (h > 0) return past ? `${h}h overdue` : `in ${h}h`;
  return past ? "overdue" : "soon";
}

const STAGES = ["follow_up", "follow_through", "follow_back"];
const STATUSES = ["pending_approval", "scheduled", "sent", "rejected"];

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: { page?: string; stage?: string; status?: string };
}) {
  const { dataset } = await getActiveTenant();

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const filters: Record<string, string> = {};
  if (searchParams.stage) filters.stage = searchParams.stage;
  if (searchParams.status) filters.status = searchParams.status;

  let rows: FollowUpRow[] = [];
  let total = 0;
  let dataOrigin: "FAKE" | "REAL" = "FAKE";
  let pendingCount = 0;
  let error: string | null = null;

  try {
    const [res, pendingRes] = await Promise.all([
      getFollowUps(dataset, PAGE_SIZE, offset, filters),
      getFollowUps(dataset, 1, 0, { status: "pending_approval" }),
    ]);
    rows = res.rows;
    total = res.total;
    dataOrigin = res.data_origin;
    pendingCount = pendingRes.total;
  } catch (e: any) {
    error = e.message;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="flex items-center gap-3 mb-2">
        <div>
          <h1 className="text-white font-semibold text-[22px]">Follow-ups</h1>
          <p className="text-[#999] text-[15px]">{total} total · {pendingCount} pending approval</p>
        </div>
        {dataOrigin === "FAKE" && <SampleDataBadge />}
      </div>

      {/* Demo notice */}
      {dataOrigin === "FAKE" && (
        <div className="mb-5 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3 text-[14px] text-amber-400/80">
          <strong className="text-amber-400">Demo mode:</strong> Approve buttons are disabled. In production, each follow-up has a one-time approval token.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-[#444] text-[13px] uppercase tracking-wider">Stage</span>
          <a href={`/dashboard/followups${searchParams.status ? `?status=${searchParams.status}` : ""}`}
            className={`px-3 py-1 rounded-full text-[14px] border transition-colors ${!searchParams.stage ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#383838] text-[#999] hover:text-[#ccc]"}`}>All</a>
          {STAGES.map(s => (
            <a key={s} href={`/dashboard/followups?stage=${s}${searchParams.status ? `&status=${searchParams.status}` : ""}`}
              className={`px-3 py-1 rounded-full text-[14px] border transition-colors capitalize ${searchParams.stage === s ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#383838] text-[#999] hover:text-[#ccc]"}`}>
              {s.replace(/_/g, " ")}
            </a>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-[#444] text-[13px] uppercase tracking-wider">Status</span>
          <a href={`/dashboard/followups${searchParams.stage ? `?stage=${searchParams.stage}` : ""}`}
            className={`px-3 py-1 rounded-full text-[14px] border transition-colors ${!searchParams.status ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#383838] text-[#999] hover:text-[#ccc]"}`}>All</a>
          {STATUSES.map(s => (
            <a key={s} href={`/dashboard/followups?status=${s}${searchParams.stage ? `&stage=${searchParams.stage}` : ""}`}
              className={`px-3 py-1 rounded-full text-[14px] border transition-colors capitalize ${searchParams.status === s ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]" : "border-[#383838] text-[#999] hover:text-[#ccc]"}`}>
              {s.replace(/_/g, " ")}
            </a>
          ))}
        </div>
      </div>

      {error ? (
        <div className="bg-[#1c1c1c] border border-[#FF2D1A]/20 rounded-xl p-5">
          <p className="text-[#FF2D1A] text-[15px]">{error}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.length === 0 ? (
            <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl p-10 text-center text-[#444] text-[15px]">
              No follow-ups found.
            </div>
          ) : (
            rows.map((fu) => (
              <div key={fu.followup_id} className="bg-[#1c1c1c] border border-[#383838] rounded-xl px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[12px] font-semibold ${STAGE_COLORS[fu.stage] ?? "text-slate-400 bg-slate-400/10"}`}>
                        {fu.stage.replace(/_/g, " ")}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[12px] font-semibold capitalize ${STATUS_COLORS[fu.status] ?? "text-slate-400 bg-slate-400/10"}`}>
                        {fu.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-[#444] text-[13px]">
                        {CHANNEL_ICONS[fu.channel]} {fu.channel}
                      </span>
                      <span className={`text-[13px] ${fu.due_at && new Date(fu.due_at) < new Date() && fu.status === "scheduled" ? "text-[#FF2D1A]" : "text-[#999]"}`}>
                        · {relativeTime(fu.due_at)}
                      </span>
                    </div>
                    <p className="text-[#ccc] text-[15px]">
                      {fu.lead_name ?? fu.lead_id}
                      {fu.lead_phone && <span className="text-[#444] ml-2">{fu.lead_phone}</span>}
                    </p>
                    {fu.draft_subject && (
                      <p className="text-[#aaa] text-[14px] mt-1.5 font-medium">{fu.draft_subject}</p>
                    )}
                    {fu.draft_text && (
                      <p className="text-[#444] text-[14px] mt-1 leading-relaxed line-clamp-2">{fu.draft_text}</p>
                    )}
                  </div>

                  {/* Approve button */}
                  {fu.status === "pending_approval" && (
                    <div className="flex-shrink-0">
                      {fu.approval_available && fu.approval_url ? (
                        <a
                          href={fu.approval_url}
                          className="inline-flex items-center px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[14px] font-semibold rounded-lg transition-colors"
                        >
                          Approve
                        </a>
                      ) : (
                        <button
                          disabled
                          title="Approval not available in demo mode"
                          className="inline-flex items-center px-4 py-2 bg-[#242424] text-[#333] text-[14px] font-semibold rounded-lg cursor-not-allowed"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-[#999] text-[14px]">Page {page} of {totalPages} · {total} follow-ups</p>
              <div className="flex gap-2">
                {page > 1 && <a href={`/dashboard/followups?page=${page - 1}${searchParams.stage ? `&stage=${searchParams.stage}` : ""}${searchParams.status ? `&status=${searchParams.status}` : ""}`} className="px-3 py-1.5 text-[14px] border border-[#383838] rounded-lg text-[#aaa] hover:text-[#ccc] transition-colors">← Prev</a>}
                {page < totalPages && <a href={`/dashboard/followups?page=${page + 1}${searchParams.stage ? `&stage=${searchParams.stage}` : ""}${searchParams.status ? `&status=${searchParams.status}` : ""}`} className="px-3 py-1.5 text-[14px] border border-[#383838] rounded-lg text-[#aaa] hover:text-[#ccc] transition-colors">Next →</a>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
