"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTenantPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    label: "",
    description: "",
    username: "",
    table_prefix: "",
    dataset: "live" as "demo" | "live",
    contact_email: "",
    admin_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ username: string; password: string } | null>(null);

  // Auto-derive username and table_prefix from label
  function handleLabelChange(label: string) {
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const prefix = label.replace(/[^a-zA-Z0-9]/g, "") + "_";
    setForm((f) => ({
      ...f,
      label,
      username: slug ? `${slug}-client` : "",
      table_prefix: prefix || "",
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create tenant");
      return;
    }

    setResult(data.credentials);
  }

  if (result) {
    return (
      <div className="p-6 max-w-[600px]">
        <div className="bg-[#141414] border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-400 text-[18px]">✓</span>
            <h2 className="text-white font-semibold text-[16px]">Tenant created</h2>
          </div>
          <p className="text-amber-400 text-[12px] font-semibold mb-4 bg-amber-400/5 border border-amber-400/15 rounded-lg px-3 py-2">
            Save these credentials now — the password will not be shown again.
          </p>
          <div className="space-y-3 mb-6">
            <div>
              <p className="text-[#444] text-[11px] uppercase tracking-wider mb-1">Username</p>
              <p className="text-white font-mono text-[14px] bg-[#0C0C0C] px-3 py-2 rounded-lg border border-[#242424]">{result.username}</p>
            </div>
            <div>
              <p className="text-[#444] text-[11px] uppercase tracking-wider mb-1">Password (one-time)</p>
              <p className="text-[#FF2D1A] font-mono text-[14px] bg-[#0C0C0C] px-3 py-2 rounded-lg border border-[#FF2D1A]/20">{result.password}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Username: ${result.username}\nPassword: ${result.password}`);
              }}
              className="px-4 py-2 bg-[#242424] hover:bg-[#2a2a2a] text-[#ccc] text-[13px] rounded-lg transition-colors"
            >
              Copy to clipboard
            </button>
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 bg-[#FF2D1A] hover:bg-[#e02718] text-white font-semibold text-[13px] rounded-lg transition-colors"
            >
              Back to admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[600px]">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/admin" className="text-[#555] hover:text-[#aaa] transition-colors">
          ← Admin
        </Link>
        <span className="text-[#2a2a2a]">/</span>
        <h1 className="text-white font-semibold text-[18px]">Create new tenant</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#242424] rounded-xl p-6 space-y-5">
        {/* Client name */}
        <div>
          <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
            Client name *
          </label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Tony Johal Real Estate"
            required
            className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Voice agent + follow-up system"
            className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
              Login username *
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              required
              className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white font-mono text-[13px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
              n8n table prefix *
            </label>
            <input
              type="text"
              value={form.table_prefix}
              onChange={(e) => setForm((f) => ({ ...f, table_prefix: e.target.value }))}
              placeholder="TJ_"
              required
              className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white font-mono text-[13px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
            />
            <p className="text-[#3a3a3a] text-[11px] mt-1">Must match n8n table names exactly</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
              Dataset *
            </label>
            <select
              value={form.dataset}
              onChange={(e) => setForm((f) => ({ ...f, dataset: e.target.value as any }))}
              className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#FF2D1A] transition-colors"
            >
              <option value="live">live (real client data)</option>
              <option value="demo">demo (sample data)</option>
            </select>
          </div>
          <div>
            <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
              Contact email
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              placeholder="client@example.com"
              className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a] pt-4">
          <label className="block text-[#888] text-[11px] uppercase tracking-wider font-medium mb-1.5">
            Your admin password (required to authorize) *
          </label>
          <input
            type="password"
            value={form.admin_password}
            onChange={(e) => setForm((f) => ({ ...f, admin_password: e.target.value }))}
            placeholder="••••••••••••"
            required
            className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#333] focus:outline-none focus:border-[#FF2D1A] transition-colors"
          />
          <p className="text-[#3a3a3a] text-[11px] mt-1">A secure password is auto-generated for the new tenant.</p>
        </div>

        {error && (
          <p className="text-[#FF2D1A] text-[13px] bg-[#FF2D1A]/10 border border-[#FF2D1A]/20 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF2D1A] hover:bg-[#e02718] disabled:opacity-50 text-white font-semibold text-[14px] rounded-lg py-2.5 transition-colors"
        >
          {loading ? "Creating…" : "Create tenant & generate credentials"}
        </button>
      </form>
    </div>
  );
}
