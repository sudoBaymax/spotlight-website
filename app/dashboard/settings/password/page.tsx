"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const mismatch = next && confirm && next !== confirm;
  const tooShort = next && next.length < 12;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setError("Passwords do not match"); return; }
    if (next.length < 12) { setError("Password must be at least 12 characters"); return; }

    setError(""); setLoading(true);

    const res = await fetch("/api/settings/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: current, new_password: next }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Failed to update password"); return; }
    setDone(true);
  }

  const INPUT_CLS =
    "w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors";

  if (done) {
    return (
      <div className="p-6 max-w-[480px]">
        <div className="bg-[#141414] border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-400 text-[18px]">✓</span>
            <h2 className="text-white font-semibold text-[16px]">Password updated</h2>
          </div>
          <p className="text-[#555] text-[13px] mb-5">
            Your new password is active. You&apos;ll need to use it next time you log in.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-flex px-4 py-2 bg-[#242424] hover:bg-[#2a2a2a] text-[#ccc] text-[13px] font-medium rounded-lg transition-colors"
          >
            ← Back to settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[480px]">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/settings" className="text-[#555] hover:text-[#aaa] transition-colors text-[14px]">
          ← Settings
        </Link>
        <span className="text-[#2a2a2a]">/</span>
        <h1 className="text-white font-semibold text-[18px]">Change password</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#242424] rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
            Current password *
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="••••••••••••"
            required
            className={INPUT_CLS}
          />
        </div>

        <div className="border-t border-[#1a1a1a] pt-4">
          <div className="mb-4">
            <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
              New password *
            </label>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Min. 12 characters"
              required
              className={`${INPUT_CLS} ${tooShort ? "border-amber-400/40" : ""}`}
            />
            {tooShort && (
              <p className="text-amber-400 text-[11px] mt-1">Must be at least 12 characters</p>
            )}
          </div>

          <div>
            <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
              Confirm new password *
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••••••"
              required
              className={`${INPUT_CLS} ${mismatch ? "border-[#FF2D1A]/40" : ""}`}
            />
            {mismatch && (
              <p className="text-[#FF2D1A] text-[11px] mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-[#FF2D1A] text-[13px] bg-[#FF2D1A]/10 border border-[#FF2D1A]/20 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !!mismatch || !!tooShort || !current || !next || !confirm}
          className="w-full bg-[#FF2D1A] hover:bg-[#e02718] disabled:opacity-50 text-white font-semibold text-[14px] rounded-lg py-2.5 transition-colors"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
