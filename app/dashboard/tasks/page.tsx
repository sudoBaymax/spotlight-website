import { getActiveTenant } from "@/lib/effective-tenant";
import { getTasks } from "@/lib/n8n-reader";
import SampleDataBadge from "@/components/dashboard/SampleDataBadge";
import type { TaskRow } from "@/lib/types";

const PAGE_SIZE = 50;

const STATUS_COLORS: Record<string, string> = {
  open: "text-amber-400 bg-amber-400/10",
  completed: "text-green-400 bg-green-400/10",
  dismissed: "text-[#555] bg-[#1a1a1a]",
};

function relativeTime(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const absDiff = Math.abs(diff);
  const h = Math.floor(absDiff / 3600000);
  const d = Math.floor(h / 24);
  const past = diff < 0;
  if (d > 0) return past ? `${d}d overdue` : `in ${d}d`;
  if (h > 0) return past ? `${h}h overdue` : `in ${h}h`;
  return past ? "overdue" : "due soon";
}

function createdRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "<1h ago";
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const { dataset } = await getActiveTenant();

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  let rows: TaskRow[] = [];
  let total = 0;
  let dataOrigin: "FAKE" | "REAL" = "FAKE";
  let error: string | null = null;

  try {
    const res = await getTasks(dataset, PAGE_SIZE, offset);
    rows = res.rows;
    total = res.total;
    dataOrigin = res.data_origin;
  } catch (e: any) {
    error = e.message;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const statusFilter = searchParams.status;
  const filtered = statusFilter ? rows.filter((r) => r.status === statusFilter) : rows;

  const openCount = rows.filter((r) => r.status === "open").length;
  const overdueCount = rows.filter(
    (r) => r.status === "open" && new Date(r.due_at) < new Date()
  ).length;

  const STATUSES = ["open", "completed", "dismissed"];

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-white font-semibold text-[20px]">Tasks</h1>
          <p className="text-[#555] text-[13px]">
            {openCount} open
            {overdueCount > 0 && (
              <span className="text-[#FF2D1A] ml-1">· {overdueCount} overdue</span>
            )}
          </p>
        </div>
        {dataOrigin === "FAKE" && <SampleDataBadge />}
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-5">
        <a
          href="/dashboard/tasks"
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
            !statusFilter
              ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]"
              : "border-[#242424] text-[#555] hover:text-[#aaa]"
          }`}
        >
          All
        </a>
        {STATUSES.map((s) => (
          <a
            key={s}
            href={`/dashboard/tasks?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors capitalize ${
              statusFilter === s
                ? "bg-[#FF2D1A]/10 border-[#FF2D1A]/30 text-[#FF2D1A]"
                : "border-[#242424] text-[#555] hover:text-[#aaa]"
            }`}
          >
            {s}
          </a>
        ))}
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
          <p className="text-[#444] text-[13px]">No tasks found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task, i) => {
            const isOverdue =
              task.status === "open" && new Date(task.due_at) < new Date();
            return (
              <div
                key={`${task.lead_id}-${i}`}
                className={`bg-[#141414] border rounded-xl px-5 py-4 ${
                  isOverdue ? "border-[#FF2D1A]/20" : "border-[#242424]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          STATUS_COLORS[task.status] ?? "text-slate-400 bg-slate-400/10"
                        }`}
                      >
                        {task.status}
                      </span>
                      {isOverdue && (
                        <span className="text-[#FF2D1A] text-[10px] font-semibold">
                          {relativeTime(task.due_at)}
                        </span>
                      )}
                      {task.owner && (
                        <span className="text-[#3a3a3a] text-[11px]">· {task.owner}</span>
                      )}
                    </div>
                    <p className="text-[#aaa] text-[13px] font-medium mb-1">{task.reason}</p>
                    {task.suggested_action && (
                      <p className="text-[#555] text-[12px] leading-relaxed">
                        {task.suggested_action}
                      </p>
                    )}
                    <p className="text-[#3a3a3a] text-[11px] mt-2 font-mono">
                      lead: {task.lead_id}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {!isOverdue && task.status === "open" && (
                      <p className="text-[#555] text-[12px]">{relativeTime(task.due_at)}</p>
                    )}
                    <p className="text-[#3a3a3a] text-[11px] mt-1">
                      {createdRelative(task.task_created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-[#555] text-[12px]">
                Page {page} of {totalPages} · {total} tasks
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`/dashboard/tasks?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                    className="px-3 py-1.5 text-[12px] border border-[#242424] rounded-lg text-[#666] hover:text-[#ccc] transition-colors"
                  >
                    ← Prev
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={`/dashboard/tasks?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
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
