// Types matching the n8n TJ - dashboard-reader response schema

export type Dataset = "demo" | "live";
export type DataOrigin = "FAKE" | "REAL";

export type View =
  | "summary"
  | "calls"
  | "leads"
  | "bookings"
  | "followups"
  | "tasks"
  | "alerts"
  | "gatelog"
  | "config";

export interface ReaderFilters {
  lead_id?: string;
  call_id?: string;
  status?: string;
  outcome?: string;
  stage?: string;
  channel?: string;
  since?: string;
  until?: string;
  search?: string;
}

export interface ReaderParams {
  dataset: Dataset;
  view: View;
  limit?: number;
  offset?: number;
  days?: number;
  filters?: ReaderFilters;
}

// ── Row types ──────────────────────────────────────────────────────────────────

export interface LeadRow {
  lead_id: string;
  name: string;
  email: string;
  phone: string;
  intent: string;
  inquiry_topic: string;
  status: string;
  reason_code: string;
  attempts: number;
  last_attempt_at: string | null;
  next_eligible_at: string | null;
  submitted_at: string;
  consent_sms: boolean;
  consent_email: boolean;
  suppression_flag: string;
  data_origin: DataOrigin;
}

export interface CallRow {
  call_id: string;
  lead_id: string;
  lead_name?: string;
  lead_phone?: string;
  direction: "inbound" | "outbound";
  attempt: number;
  duration_s: number;
  outcome: string;
  objection_type: string;
  compliance_flag: boolean;
  summary: string;
  timestamp: string;
  cost_usd: number;
  data_origin: DataOrigin;
}

export interface BookingRow {
  idem_key: string;
  call_id: string;
  lead_id: string;
  lead_name: string;
  phone: string;
  email: string;
  start_iso: string;
  status: string;
  confirm_status: string;
  sms_sent_at: string | null;
  email_sent_at: string | null;
  data_origin: DataOrigin;
}

export interface FollowUpRow {
  followup_id: string;
  lead_id: string;
  call_id: string;
  lead_name?: string;
  lead_phone?: string;
  stage: "follow_up" | "follow_through" | "follow_back";
  channel: "email" | "sms" | "task";
  due_at: string;
  status: string;
  draft_subject: string;
  draft_text: string;
  approval_available: boolean;
  approval_url: string | null;
  sent_at: string | null;
  data_origin: DataOrigin;
}

export interface TaskRow {
  lead_id: string;
  reason: string;
  suggested_action: string;
  due_at: string;
  status: string;
  owner: string;
  task_created_at: string;
  data_origin: DataOrigin;
}

export interface AlertRow {
  call_id: string;
  type: string;
  severity: "medium" | "high";
  detail: string;
  alert_created_at: string;
  resolved_at: string | null;
  data_origin: DataOrigin;
}

// ── Summary response ───────────────────────────────────────────────────────────

export interface SummaryResponse {
  ok: boolean;
  dataset: Dataset;
  data_origin: DataOrigin;
  window_days: number;
  leads: {
    total: number;
    new_in_window: number;
    by_status: Record<string, number>;
    by_intent: Record<string, number>;
  };
  calls: {
    total: number;
    connected: number;
    booked: number;
    connect_rate: number;
    booking_rate_of_connected: number;
    avg_connected_duration_s: number;
    by_outcome: Record<string, number>;
    per_day: Array<{ date: string; calls: number; connected: number; booked: number }>;
  };
  bookings: {
    confirmed_in_window: number;
    upcoming: number;
    sms_confirmations_sent: number;
    email_confirmations_sent: number;
  };
  followups: {
    total: number;
    pending_approval: number;
    by_stage_status: Record<string, number>;
  };
  tasks: {
    open: number;
    overdue: number;
  };
  compliance: {
    open_alerts: number;
    high_open: number;
  };
  safety: {
    environment: string;
    dialing_enabled: string;
    sms_enabled: string;
    dial_allowlist: string;
    sms_allowlist: string;
    followup_approval_live: string;
  };
  generated_at: string;
}

export interface ListResponse<T> {
  ok: boolean;
  dataset: Dataset;
  view: View;
  data_origin: DataOrigin;
  total: number;
  limit: number;
  offset: number;
  rows: T[];
  generated_at: string;
}
