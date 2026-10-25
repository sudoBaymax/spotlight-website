import type {
  Dataset,
  ReaderParams,
  ReaderFilters,
  SummaryResponse,
  ListResponse,
  LeadRow,
  CallRow,
  BookingRow,
  FollowUpRow,
  TaskRow,
  AlertRow,
} from "./types";
import { withCache, readerKey } from "./cache";

const READER_URL =
  "https://spotlight-security-group.app.n8n.cloud/webhook/tj-dashboard-read";

// TTLs — summary/list pages cache for 30s; pending-approval count for 15s
// (shorter so the sidebar badge stays reasonably fresh)
const TTL_DEFAULT = 30;
const TTL_BADGE = 15;

async function callReader<T>(params: ReaderParams): Promise<T> {
  const token = process.env.DASHBOARD_READER_TOKEN;
  if (!token) throw new Error("DASHBOARD_READER_TOKEN is not set");

  // n8n Cloud can take 20-30s on a cold start — give it time
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);

  let res: Response;
  try {
    res = await fetch(READER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dashboard-token": token,
      },
      body: JSON.stringify(params),
      signal: controller.signal,
      // Don't use Next.js fetch cache — we manage caching ourselves via Redis
      cache: "no-store",
    });
  } catch (e: any) {
    if (e.name === "AbortError") {
      throw new Error("n8n is warming up — refresh in a moment");
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 404) {
    throw new Error("Reader workflow not published yet — publish TJ - dashboard-reader in n8n");
  }
  if (res.status === 403) {
    throw new Error("Invalid dashboard token — check DASHBOARD_READER_TOKEN in .env");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Reader error ${res.status}: ${body}`);
  }

  const data = await res.json();
  if (!data.ok) throw new Error(`Reader returned ok:false — ${data.error ?? "unknown"}`);
  return data;
}

export const getSummary = (dataset: Dataset, days = 30): Promise<SummaryResponse> =>
  withCache(
    readerKey(dataset, "summary", { days }),
    TTL_DEFAULT,
    () => callReader({ dataset, view: "summary", days })
  );

export const getCalls = (
  dataset: Dataset,
  limit = 50,
  offset = 0,
  filters: ReaderFilters = {}
): Promise<ListResponse<CallRow>> =>
  withCache(
    readerKey(dataset, "calls", { limit, offset, ...filters }),
    TTL_DEFAULT,
    () => callReader({ dataset, view: "calls", limit, offset, filters })
  );

export const getLeads = (
  dataset: Dataset,
  limit = 50,
  offset = 0,
  filters: ReaderFilters = {}
): Promise<ListResponse<LeadRow>> =>
  withCache(
    readerKey(dataset, "leads", { limit, offset, ...filters }),
    TTL_DEFAULT,
    () => callReader({ dataset, view: "leads", limit, offset, filters })
  );

export const getBookings = (
  dataset: Dataset,
  limit = 50,
  offset = 0
): Promise<ListResponse<BookingRow>> =>
  withCache(
    readerKey(dataset, "bookings", { limit, offset }),
    TTL_DEFAULT,
    () => callReader({ dataset, view: "bookings", limit, offset })
  );

export const getFollowUps = (
  dataset: Dataset,
  limit = 50,
  offset = 0,
  filters: ReaderFilters = {}
): Promise<ListResponse<FollowUpRow>> =>
  withCache(
    readerKey(dataset, "followups", { limit, offset, ...filters }),
    filters.status === "pending_approval" ? TTL_BADGE : TTL_DEFAULT,
    () => callReader({ dataset, view: "followups", limit, offset, filters })
  );

export const getTasks = (
  dataset: Dataset,
  limit = 50,
  offset = 0
): Promise<ListResponse<TaskRow>> =>
  withCache(
    readerKey(dataset, "tasks", { limit, offset }),
    TTL_DEFAULT,
    () => callReader({ dataset, view: "tasks", limit, offset })
  );

export const getAlerts = (
  dataset: Dataset,
  limit = 50,
  offset = 0
): Promise<ListResponse<AlertRow>> =>
  withCache(
    readerKey(dataset, "alerts", { limit, offset }),
    TTL_DEFAULT,
    () => callReader({ dataset, view: "alerts", limit, offset })
  );
