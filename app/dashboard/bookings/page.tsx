import { getActiveTenant } from "@/lib/effective-tenant";
import { getBookings } from "@/lib/n8n-reader";
import SampleDataBadge from "@/components/dashboard/SampleDataBadge";
import type { BookingRow } from "@/lib/types";

const PAGE_SIZE = 50;

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (diff < 0) return "upcoming";
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `<1h ago`;
}

function ConfirmBadge({ status }: { status: string | null }) {
  const sms = status?.includes("sms:sent") ?? false;
  const email = status?.includes("email:sent") ?? false;
  return (
    <div className="flex gap-1.5">
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[12px] font-semibold ${sms ? "bg-green-400/10 text-green-400" : "bg-[#242424] text-[#444]"}`}>SMS</span>
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[12px] font-semibold ${email ? "bg-green-400/10 text-green-400" : "bg-[#242424] text-[#444]"}`}>Email</span>
    </div>
  );
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const { dataset } = await getActiveTenant();

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  let rows: BookingRow[] = [];
  let total = 0;
  let dataOrigin: "FAKE" | "REAL" = "FAKE";
  let error: string | null = null;

  try {
    const res = await getBookings(dataset, PAGE_SIZE, offset);
    rows = res.rows;
    total = res.total;
    dataOrigin = res.data_origin;
  } catch (e: any) {
    error = e.message;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const upcoming = rows.filter((r) => new Date(r.start_iso) > new Date());
  const past = rows.filter((r) => new Date(r.start_iso) <= new Date());

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-white font-semibold text-[22px]">Bookings</h1>
          <p className="text-[#999] text-[15px]">{total} confirmed · {upcoming.length} upcoming</p>
        </div>
        {dataOrigin === "FAKE" && <SampleDataBadge />}
      </div>

      {error ? (
        <div className="bg-[#1c1c1c] border border-[#FF2D1A]/20 rounded-xl p-5">
          <p className="text-[#FF2D1A] text-[15px]">{error}</p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-4">
              <p className="text-[#999] text-[13px] uppercase tracking-wider font-medium mb-3">Upcoming</p>
              <div className="space-y-2">
                {upcoming.map((b) => (
                  <div key={b.idem_key} className="bg-[#1c1c1c] border border-[#383838] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-medium text-[15px]">{b.lead_name}</p>
                      <p className="text-[#999] text-[14px] mt-0.5">{b.phone} · {b.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#22c55e] font-semibold text-[15px]">{formatDateTime(b.start_iso)}</p>
                      <div className="mt-1.5 flex justify-end"><ConfirmBadge status={b.confirm_status} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All bookings table */}
          <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl overflow-hidden">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-[#444] text-[13px] uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Lead</th>
                  <th className="text-left px-4 py-3 font-medium">Contact</th>
                  <th className="text-left px-4 py-3 font-medium">Appointment</th>
                  <th className="text-left px-4 py-3 font-medium">Confirmations</th>
                  <th className="text-right px-4 py-3 font-medium">Booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {rows.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-[#444]">No bookings yet.</td></tr>
                ) : (
                  rows.map((b) => (
                    <tr key={b.idem_key} className="hover:bg-[#181818] transition-colors">
                      <td className="px-4 py-3 text-[#ccc]">{b.lead_name}</td>
                      <td className="px-4 py-3">
                        <p className="text-[#aaa] text-[14px]">{b.phone}</p>
                        <p className="text-[#444] text-[13px] mt-0.5 truncate max-w-[160px]">{b.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className={`text-[15px] font-medium ${new Date(b.start_iso) > new Date() ? "text-[#22c55e]" : "text-[#bbb]"}`}>
                          {formatDateTime(b.start_iso)}
                        </p>
                      </td>
                      <td className="px-4 py-3"><ConfirmBadge status={b.confirm_status} /></td>
                      <td className="px-4 py-3 text-right text-[#444]">{relativeTime(b.start_iso)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
                <p className="text-[#999] text-[14px]">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  {page > 1 && <a href={`/dashboard/bookings?page=${page - 1}`} className="px-3 py-1.5 text-[14px] border border-[#383838] rounded-lg text-[#aaa] hover:text-[#ccc] transition-colors">← Prev</a>}
                  {page < totalPages && <a href={`/dashboard/bookings?page=${page + 1}`} className="px-3 py-1.5 text-[14px] border border-[#383838] rounded-lg text-[#aaa] hover:text-[#ccc] transition-colors">Next →</a>}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
