"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ByokKeys {
  openai_key: string | null;
  twilio_sid: string | null;
  twilio_token: string | null;
  sendgrid_key: string | null;
}

interface TenantData {
  id: string;
  username: string;
  label: string;
  description: string;
  table_prefix: string;
  dataset: "demo" | "live";
  role: "superadmin" | "client";
  active: boolean;
  byok: ByokKeys;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

const INPUT_CLS =
  "w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors";
const MONO_INPUT_CLS =
  "w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white font-mono text-[13px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
      {children}
    </label>
  );
}

function AdminPassField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="border-t border-[#1a1a1a] pt-4">
      <FieldLabel>Admin password (required to save) *</FieldLabel>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••••••"
        className={INPUT_CLS}
      />
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p className="text-[#FF2D1A] text-[13px] bg-[#FF2D1A]/10 border border-[#FF2D1A]/20 rounded-lg px-3.5 py-2.5">
      {msg}
    </p>
  );
}

function SuccessMsg({ msg }: { msg: string }) {
  return (
    <p className="text-green-400 text-[13px] bg-green-400/5 border border-green-400/20 rounded-lg px-3.5 py-2.5">
      {msg}
    </p>
  );
}

export default function TenantManagePage({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [pageState, setPageState] = useState<"loading" | "notfound" | "ok">("loading");

  // --- Info section ---
  const [infoLabel, setInfoLabel] = useState("");
  const [infoDesc, setInfoDesc] = useState("");
  const [infoEmail, setInfoEmail] = useState("");
  const [infoPass, setInfoPass] = useState("");
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState("");
  const [infoSuccess, setInfoSuccess] = useState(false);

  // --- BYOK section ---
  const [byok, setByok] = useState<Record<string, string>>({
    openai_key: "",
    twilio_sid: "",
    twilio_token: "",
    sendgrid_key: "",
  });
  const [byokPass, setByokPass] = useState("");
  const [byokLoading, setByokLoading] = useState(false);
  const [byokError, setByokError] = useState("");
  const [byokSuccess, setByokSuccess] = useState(false);

  // --- Reset password section ---
  const [resetPass, setResetPass] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [newPassword, setNewPassword] = useState<string | null>(null);

  // --- Status section ---
  const [statusPass, setStatusPass] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/tenants/${params.id}`)
      .then(async (r) => {
        if (r.status === 404) { setPageState("notfound"); return; }
        const data = await r.json();
        const t: TenantData = data.tenant;
        setTenant(t);
        setInfoLabel(t.label);
        setInfoDesc(t.description ?? "");
        setInfoEmail(t.contact_email ?? "");
        setByok({
          openai_key: t.byok.openai_key ?? "",
          twilio_sid: t.byok.twilio_sid ?? "",
          twilio_token: t.byok.twilio_token ?? "",
          sendgrid_key: t.byok.sendgrid_key ?? "",
        });
        setPageState("ok");
      })
      .catch(() => setPageState("notfound"));
  }, [params.id]);

  async function patchTenant(body: object) {
    return fetch(`/api/admin/tenants/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    setInfoError(""); setInfoSuccess(false); setInfoLoading(true);
    const res = await patchTenant({
      label: infoLabel,
      description: infoDesc,
      contact_email: infoEmail,
      admin_password: infoPass,
    });
    const data = await res.json();
    setInfoLoading(false);
    if (!res.ok) { setInfoError(data.error ?? "Failed to save"); return; }
    setTenant((t) => t ? { ...t, label: infoLabel, description: infoDesc, contact_email: infoEmail } : t);
    setInfoSuccess(true); setInfoPass("");
    setTimeout(() => setInfoSuccess(false), 3000);
  }

  async function saveBYOK(e: React.FormEvent) {
    e.preventDefault();
    setByokError(""); setByokSuccess(false); setByokLoading(true);
    // Preserve existing values for blank fields; clear when explicitly emptied
    const byokUpdate = {
      openai_key: byok.openai_key.trim() || null,
      twilio_sid: byok.twilio_sid.trim() || null,
      twilio_token: byok.twilio_token.trim() || null,
      sendgrid_key: byok.sendgrid_key.trim() || null,
    };
    const res = await patchTenant({ byok: byokUpdate, admin_password: byokPass });
    const data = await res.json();
    setByokLoading(false);
    if (!res.ok) { setByokError(data.error ?? "Failed to save"); return; }
    setTenant((t) => t ? { ...t, byok: data.tenant.byok } : t);
    setByokSuccess(true); setByokPass("");
    setTimeout(() => setByokSuccess(false), 3000);
  }

  async function doResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetError(""); setResetLoading(true);
    const res = await patchTenant({ action: "reset_password", admin_password: resetPass });
    const data = await res.json();
    setResetLoading(false);
    if (!res.ok) { setResetError(data.error ?? "Failed to reset"); return; }
    setNewPassword(data.credentials.password); setResetPass("");
  }

  async function toggleActive() {
    setStatusError(""); setStatusLoading(true);
    const action = tenant!.active ? "deactivate" : "activate";
    const res = await patchTenant({ action, admin_password: statusPass });
    const data = await res.json();
    setStatusLoading(false);
    if (!res.ok) { setStatusError(data.error ?? "Failed"); return; }
    setTenant((t) => t ? { ...t, active: data.tenant.active } : t);
    setStatusPass("");
  }

  if (pageState === "loading") {
    return <div className="p-6 text-[#555] text-[13px]">Loading…</div>;
  }

  if (pageState === "notfound" || !tenant) {
    return (
      <div className="p-6">
        <p className="text-[#FF2D1A] text-[14px] mb-2">Tenant not found.</p>
        <Link href="/dashboard/admin" className="text-[#555] hover:text-[#aaa] text-[13px]">← Back to admin</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[680px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-7">
        <Link href="/dashboard/admin" className="text-[#555] hover:text-[#aaa] transition-colors text-[14px]">
          ← Admin
        </Link>
        <span className="text-[#2a2a2a]">/</span>
        <h1 className="text-white font-semibold text-[18px]">{tenant.label}</h1>
        {!tenant.active && (
          <span className="text-[10px] font-semibold text-[#555] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded-full">
            Inactive
          </span>
        )}
        {tenant.dataset === "demo" && (
          <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/5 border border-amber-400/15 px-2 py-0.5 rounded-full">
            Sample data
          </span>
        )}
        {tenant.role === "superadmin" && (
          <span className="text-[10px] font-bold text-[#FF2D1A] bg-[#FF2D1A]/10 border border-[#FF2D1A]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Superadmin
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* ── Account info (read-only) ─────────────────────────── */}
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-5">
          <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium mb-4">Account info</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-[12px]">
            {[
              { label: "Tenant ID", value: tenant.id, mono: true },
              { label: "Login username", value: tenant.username, mono: true },
              { label: "n8n table prefix", value: tenant.table_prefix, mono: true },
              { label: "Dataset", value: tenant.dataset },
              { label: "Role", value: tenant.role },
              { label: "Created", value: new Date(tenant.created_at).toLocaleDateString("en-CA") },
            ].map(({ label, value, mono }) => (
              <div key={label}>
                <p className="text-[#3a3a3a] uppercase tracking-wider text-[10px] mb-1">{label}</p>
                <p className={`text-[#666] truncate ${mono ? "font-mono" : ""}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
            <Link
              href={`/api/admin/impersonate?as=${tenant.id}`}
              className="inline-flex items-center gap-1.5 text-[12px] text-[#888] hover:text-white border border-[#242424] hover:border-[#3a3a3a] px-3 py-1.5 rounded-lg transition-colors"
            >
              View dashboard →
            </Link>
          </div>
        </div>

        {/* ── Client details (editable) ─────────────────────────── */}
        <form onSubmit={saveInfo} className="bg-[#141414] border border-[#242424] rounded-xl p-5 space-y-4">
          <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium">Client details</p>
          <div>
            <FieldLabel>Client name *</FieldLabel>
            <input type="text" value={infoLabel} onChange={(e) => setInfoLabel(e.target.value)} required className={INPUT_CLS} />
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <input type="text" value={infoDesc} onChange={(e) => setInfoDesc(e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <FieldLabel>Contact email</FieldLabel>
            <input type="email" value={infoEmail} onChange={(e) => setInfoEmail(e.target.value)} className={INPUT_CLS} />
          </div>
          <AdminPassField value={infoPass} onChange={setInfoPass} />
          {infoError && <ErrorMsg msg={infoError} />}
          {infoSuccess && <SuccessMsg msg="Changes saved." />}
          <button
            type="submit"
            disabled={infoLoading}
            className="px-4 py-2 bg-[#FF2D1A] hover:bg-[#e02718] disabled:opacity-50 text-white font-semibold text-[13px] rounded-lg transition-colors"
          >
            {infoLoading ? "Saving…" : "Save changes"}
          </button>
        </form>

        {/* ── BYOK API keys ─────────────────────────── */}
        <form onSubmit={saveBYOK} className="bg-[#141414] border border-[#242424] rounded-xl p-5 space-y-4">
          <div>
            <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium mb-0.5">BYOK API keys</p>
            <p className="text-[#3a3a3a] text-[11px]">Client&apos;s own keys — leave blank to clear, or paste a new value to update.</p>
          </div>
          {(
            [
              { key: "openai_key", label: "OpenAI API key", placeholder: "sk-..." },
              { key: "twilio_sid", label: "Twilio account SID", placeholder: "ACxxxxxxxxxxxxxxxx" },
              { key: "twilio_token", label: "Twilio auth token", placeholder: "••••••••••" },
              { key: "sendgrid_key", label: "SendGrid API key", placeholder: "SG.xxxxx" },
            ] as const
          ).map(({ key, label, placeholder }) => (
            <div key={key}>
              <FieldLabel>
                {label}
                {tenant.byok[key] && (
                  <span className="ml-2 text-green-400 text-[10px] font-semibold normal-case">✓ set</span>
                )}
              </FieldLabel>
              <input
                type="text"
                value={byok[key]}
                onChange={(e) => setByok((b) => ({ ...b, [key]: e.target.value }))}
                placeholder={tenant.byok[key] ? "Leave blank to keep current" : placeholder}
                className={MONO_INPUT_CLS}
              />
            </div>
          ))}
          <AdminPassField value={byokPass} onChange={setByokPass} />
          {byokError && <ErrorMsg msg={byokError} />}
          {byokSuccess && <SuccessMsg msg="API keys saved." />}
          <button
            type="submit"
            disabled={byokLoading}
            className="px-4 py-2 bg-[#242424] hover:bg-[#2a2a2a] disabled:opacity-50 text-[#ccc] font-semibold text-[13px] rounded-lg transition-colors"
          >
            {byokLoading ? "Saving…" : "Save API keys"}
          </button>
        </form>

        {/* ── Reset password ─────────────────────────── */}
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-5 space-y-4">
          <div>
            <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium mb-0.5">Reset client password</p>
            <p className="text-[#3a3a3a] text-[11px]">Generates a new secure password. The old one stops working immediately.</p>
          </div>

          {newPassword ? (
            <div className="space-y-3">
              <p className="text-amber-400 text-[12px] font-semibold bg-amber-400/5 border border-amber-400/15 rounded-lg px-3 py-2">
                Save this password — it will not be shown again.
              </p>
              <div className="bg-[#0C0C0C] border border-[#FF2D1A]/20 rounded-lg px-3.5 py-2.5">
                <p className="text-[#3a3a3a] text-[10px] uppercase tracking-wider mb-1">New password</p>
                <p className="text-[#FF2D1A] font-mono text-[14px] break-all">{newPassword}</p>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(newPassword)}
                className="px-3 py-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-[#888] text-[12px] rounded-lg transition-colors"
              >
                Copy password
              </button>
            </div>
          ) : (
            <form onSubmit={doResetPassword} className="space-y-4">
              <AdminPassField value={resetPass} onChange={setResetPass} />
              {resetError && <ErrorMsg msg={resetError} />}
              <button
                type="submit"
                disabled={resetLoading}
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 disabled:opacity-50 text-amber-400 font-semibold text-[13px] rounded-lg transition-colors"
              >
                {resetLoading ? "Resetting…" : "Generate new password"}
              </button>
            </form>
          )}
        </div>

        {/* ── Activate / Deactivate (not for superadmin) ─────────────────────────── */}
        {tenant.role !== "superadmin" && (
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-5 space-y-4">
            <div>
              <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium mb-2">Account status</p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${tenant.active ? "bg-green-400" : "bg-[#3a3a3a]"}`}
                />
                <span className="text-[#888] text-[13px]">
                  {tenant.active ? "Active — client can log in" : "Inactive — login disabled"}
                </span>
              </div>
            </div>
            <div className="border-t border-[#1a1a1a] pt-4">
              <FieldLabel>Admin password *</FieldLabel>
              <input
                type="password"
                value={statusPass}
                onChange={(e) => setStatusPass(e.target.value)}
                placeholder="••••••••••••"
                className={INPUT_CLS}
              />
            </div>
            {statusError && <ErrorMsg msg={statusError} />}
            <button
              type="button"
              onClick={toggleActive}
              disabled={statusLoading || !statusPass.trim()}
              className={`px-4 py-2 disabled:opacity-50 font-semibold text-[13px] rounded-lg transition-colors ${
                tenant.active
                  ? "bg-[#FF2D1A]/10 hover:bg-[#FF2D1A]/20 border border-[#FF2D1A]/20 text-[#FF2D1A]"
                  : "bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400"
              }`}
            >
              {statusLoading ? "…" : tenant.active ? "Deactivate tenant" : "Activate tenant"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
