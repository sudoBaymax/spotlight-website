"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ByokStatus {
  openai_key: boolean;
  twilio_sid: boolean;
  twilio_token: boolean;
  sendgrid_key: boolean;
}

const KEYS = [
  {
    id: "openai_key" as const,
    label: "OpenAI API key",
    placeholder: "sk-...",
    why: "Powers Sophie's AI responses and follow-up message drafting",
    link: "platform.openai.com/api-keys",
  },
  {
    id: "twilio_sid" as const,
    label: "Twilio account SID",
    placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    why: "Sends SMS confirmation and follow-up texts",
    link: "console.twilio.com",
  },
  {
    id: "twilio_token" as const,
    label: "Twilio auth token",
    placeholder: "••••••••••••••••••••••••••••••••",
    why: "Authenticates your Twilio account for SMS sending",
    link: "console.twilio.com",
  },
  {
    id: "sendgrid_key" as const,
    label: "SendGrid API key",
    placeholder: "SG.xxxxxxxxxxxxxxxxxxxx",
    why: "Sends booking confirmation and follow-up emails",
    link: "app.sendgrid.com/settings/api_keys",
  },
] as const;

type KeyId = (typeof KEYS)[number]["id"];

function StatusPill({ set }: { set: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
        set
          ? "border-green-400/20 text-green-400 bg-green-400/5"
          : "border-[#242424] text-[#3a3a3a]"
      }`}
    >
      {set ? "✓ Connected" : "Not set"}
    </span>
  );
}

export default function SettingsPage() {
  const [status, setStatus] = useState<ByokStatus | null>(null);
  const [values, setValues] = useState<Record<KeyId, string>>({
    openai_key: "",
    twilio_sid: "",
    twilio_token: "",
    sendgrid_key: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings/byok")
      .then((r) => r.json())
      .then((d) => setStatus(d.byok))
      .catch(() => {});
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaved(false); setLoading(true);

    const res = await fetch("/api/settings/byok", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...values }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to save");
      return;
    }

    // Refresh status from the saved booleans
    setStatus({
      openai_key: !!data.byok.openai_key,
      twilio_sid: !!data.byok.twilio_sid,
      twilio_token: !!data.byok.twilio_token,
      sendgrid_key: !!data.byok.sendgrid_key,
    });
    setValues({ openai_key: "", twilio_sid: "", twilio_token: "", sendgrid_key: "" });
    setPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  const allConnected = status
    ? Object.values(status).every(Boolean)
    : false;

  return (
    <div className="p-6 max-w-[640px]">
      <div className="mb-7">
        <h1 className="text-white font-semibold text-[20px]">Setup</h1>
        <p className="text-[#555] text-[13px] mt-1">
          Connect your own API accounts to activate the follow-up automation. Your keys are stored encrypted and never shared.
        </p>
      </div>

      {/* Status overview */}
      <div className="bg-[#141414] border border-[#242424] rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium">Connection status</p>
          {allConnected && (
            <span className="text-green-400 text-[12px] font-semibold">All systems go</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {KEYS.map(({ id, label }) => (
            <div key={id} className="flex items-center justify-between gap-2">
              <span className="text-[#666] text-[12px]">{label}</span>
              <StatusPill set={status?.[id] ?? false} />
            </div>
          ))}
        </div>
      </div>

      {/* Key entry form */}
      <form onSubmit={handleSave} className="bg-[#141414] border border-[#242424] rounded-xl p-5 space-y-5">
        <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium">
          {status && Object.values(status).some(Boolean) ? "Update API keys" : "Add API keys"}
        </p>

        {KEYS.map(({ id, label, placeholder, why }) => (
          <div key={id}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[#888] text-[11px] uppercase tracking-wider font-medium">
                {label}
              </label>
              {status?.[id] && (
                <span className="text-[10px] text-green-400 font-semibold">Currently set — paste to replace</span>
              )}
            </div>
            <input
              type="text"
              value={values[id]}
              onChange={(e) => setValues((v) => ({ ...v, [id]: e.target.value }))}
              placeholder={status?.[id] ? "Leave blank to keep current" : placeholder}
              className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white font-mono text-[13px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
            />
            <p className="text-[#3a3a3a] text-[11px] mt-1">{why}</p>
          </div>
        ))}

        {/* Password gate */}
        <div className="border-t border-[#1a1a1a] pt-4">
          <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
            Your password (required to save) *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
          />
          <p className="text-[#3a3a3a] text-[11px] mt-1">
            Keys are encrypted at rest. Your values are never visible after saving.
          </p>
        </div>

        {error && (
          <p className="text-[#FF2D1A] text-[13px] bg-[#FF2D1A]/10 border border-[#FF2D1A]/20 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}
        {saved && (
          <p className="text-green-400 text-[13px] bg-green-400/5 border border-green-400/20 rounded-lg px-3.5 py-2.5">
            API keys saved. Your follow-up automation is now active.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password.trim()}
          className="w-full bg-[#FF2D1A] hover:bg-[#e02718] disabled:opacity-50 text-white font-semibold text-[14px] rounded-lg py-2.5 transition-colors"
        >
          {loading ? "Saving…" : "Save API keys"}
        </button>
      </form>

      {/* Help section */}
      <div className="mt-4 bg-[#141414] border border-[#242424] rounded-xl p-5">
        <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium mb-3">Where to find your keys</p>
        <div className="space-y-2.5">
          {KEYS.map(({ id, label, link }) => (
            <div key={id} className="flex items-center justify-between text-[12px]">
              <span className="text-[#666]">{label}</span>
              <span className="text-[#3a3a3a] font-mono">{link}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account section */}
      <div className="mt-4 bg-[#141414] border border-[#242424] rounded-xl p-5">
        <p className="text-[#555] text-[11px] uppercase tracking-wider font-medium mb-3">Account</p>
        <Link
          href="/dashboard/settings/password"
          className="flex items-center justify-between text-[13px] text-[#666] hover:text-white transition-colors"
        >
          <span>Change password</span>
          <span className="text-[#3a3a3a]">→</span>
        </Link>
      </div>
    </div>
  );
}
