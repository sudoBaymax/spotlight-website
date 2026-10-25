import { getActiveTenant } from "@/lib/effective-tenant";
import { getSummary } from "@/lib/n8n-reader";
import StatCard from "@/components/dashboard/StatCard";
import SampleDataBadge from "@/components/dashboard/SampleDataBadge";
import type { SummaryResponse } from "@/lib/types";

// Reader returns rates as percentages already (e.g. 35.2 = 35.2%), not ratios
function pct(n: number) {
  return `${Math.round(n)}%`;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function OutcomeBar({ label, count, total }: { label: string; count: number; total: number }) {
  const width = total > 0 ? Math.round((count / total) * 100) : 0;
  const COLORS: Record<string, string> = {
    booked: "#22c55e",
    no_answer: "#3b82f6",
    voicemail: "#6366f1",
    not_interested: "#f59e0b",
    callback: "#8b5cf6",
    other: "#64748b",
    wrong_number: "#94a3b8",
    dnc: "#FF2D1A",
  };
  const color = COLORS[label] ?? "#64748b";
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#999] text-[14px] w-28 text-right capitalize">{label.replace(/_/g, " ")}</span>
      <div className="flex-1 bg-[#242424] rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${width}%`, background: color }} />
      </div>
      <span className="text-[#bbb] text-[14px] w-8 text-right">{count}</span>
    </div>
  );
}

function ReaderError({ message }: { message: string }) {
  return (
    <div className="m-6 bg-[#1c1c1c] border border-[#FF2D1A]/20 rounded-xl p-6">
      <p className="text-[#FF2D1A] font-semibold text-[15px] mb-1">Reader unavailable</p>
      <p className="text-[#aaa] text-[15px]">{message}</p>
      {message.includes("not published") && (
        <p className="text-[#999] text-[14px] mt-3">
          Go to n8n → open <strong className="text-[#bbb]">TJ - dashboard-reader</strong> → click Activate.
        </p>
      )}
    </div>
  );
}

export default async function OverviewPage() {
  const { dataset } = await getActiveTenant();

  let summary: SummaryResponse | null = null;
  let readerError: string | null = null;

  try {
    summary = await getSummary(dataset, 30);
  } catch (e: any) {
    readerError = e.message;
  }

  if (readerError || !summary) {
    return <ReaderError message={readerError ?? "Unknown error"} />;
  }

  const { leads, calls, bookings, followups, tasks, compliance, safety } = summary;

  const outcomeEntries = Object.entries(calls.by_outcome).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <div>
          <h1 className="text-white font-semibold text-[22px]">Overview</h1>
          <p className="text-[#999] text-[15px]">Last {summary.window_days} days</p>
        </div>
        {summary.data_origin === "FAKE" && <SampleDataBadge />}
        {safety.environment === "DEMO" && (
          <span className="ml-auto text-[13px] text-[#666] bg-[#1c1c1c] border border-[#383838] px-2.5 py-1 rounded-full">
            Dialing off · SMS off
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total leads"
          value={leads.total}
          sub={`+${leads.new_in_window} in window`}
        />
        <StatCard
          label="Calls made"
          value={calls.total}
          sub={`${pct(calls.connect_rate)} connect rate`}
        />
        <StatCard
          label="Bookings"
          value={bookings.confirmed_in_window}
          sub={`${bookings.upcoming} upcoming`}
          accent
        />
        <StatCard
          label="Pending approval"
          value={followups.pending_approval}
          sub={`${tasks.open} open tasks · ${tasks.overdue} overdue`}
        />
      </div>

      {/* Two-col: outcomes + lead status */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Call outcomes */}
        <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl p-5">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-white font-semibold text-[15px]">Call outcomes</p>
            <p className="text-[#999] text-[14px]">
              Avg connected: {fmt(calls.avg_connected_duration_s)}
            </p>
          </div>
          <div className="space-y-2.5">
            {outcomeEntries.map(([label, count]) => (
              <OutcomeBar key={label} label={label} count={count} total={calls.total} />
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#2a2a2a] grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-white font-semibold text-[20px]">{pct(calls.connect_rate)}</p>
              <p className="text-[#999] text-[13px]">Connect rate</p>
            </div>
            <div>
              <p className="text-white font-semibold text-[20px]">{pct(calls.booking_rate_of_connected)}</p>
              <p className="text-[#999] text-[13px]">Book rate (connected)</p>
            </div>
            <div>
              <p className="text-white font-semibold text-[20px]">{calls.booked}</p>
              <p className="text-[#999] text-[13px]">Total booked</p>
            </div>
          </div>
        </div>

        {/* Lead status breakdown */}
        <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl p-5">
          <p className="text-white font-semibold text-[15px] mb-4">Lead pipeline</p>
          <div className="space-y-2.5">
            {Object.entries(leads.by_status)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-[#bbb] text-[15px] capitalize">{status.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-[#242424] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#FF2D1A]/60 rounded-full"
                        style={{ width: `${Math.round((count / leads.total) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[#aaa] text-[14px] w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Follow-up breakdown */}
          <div className="mt-5 pt-4 border-t border-[#2a2a2a]">
            <p className="text-[#999] text-[13px] uppercase tracking-wider font-medium mb-3">Follow-up queue</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#0C0C0C] rounded-lg py-3">
                <p className="text-white font-semibold text-[17px]">{followups.total}</p>
                <p className="text-[#999] text-[13px]">Total</p>
              </div>
              <div className="bg-[#0C0C0C] rounded-lg py-3">
                <p className="text-[#FF2D1A] font-semibold text-[17px]">{followups.pending_approval}</p>
                <p className="text-[#999] text-[13px]">Pending</p>
              </div>
              <div className="bg-[#0C0C0C] rounded-lg py-3">
                <p className="text-white font-semibold text-[17px]">
                  {compliance.open_alerts}
                </p>
                <p className="text-[#999] text-[13px]">Alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily activity — last 7 days */}
      {calls.per_day && calls.per_day.length > 0 && (
        <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl p-5">
          <p className="text-white font-semibold text-[15px] mb-4">Daily activity (last 7 days)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="text-[#999] uppercase tracking-wider text-[12px]">
                  <th className="text-left pb-2 font-medium">Date</th>
                  <th className="text-right pb-2 font-medium">Calls</th>
                  <th className="text-right pb-2 font-medium">Connected</th>
                  <th className="text-right pb-2 font-medium">Booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {calls.per_day.slice(-7).reverse().map((d) => (
                  <tr key={d.date}>
                    <td className="py-2 text-[#bbb]">{d.date}</td>
                    <td className="py-2 text-right text-[#ccc]">{d.calls}</td>
                    <td className="py-2 text-right text-[#ccc]">{d.connected}</td>
                    <td className="py-2 text-right text-[#22c55e] font-medium">{d.booked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
