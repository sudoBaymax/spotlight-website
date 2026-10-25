"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#FF2D1A" />
            <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5 16h7" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <span className="text-white font-semibold text-[18px] tracking-tight">Spotlight</span>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-8">
          <h1 className="text-white font-semibold text-[17px] mb-1">Dashboard login</h1>
          <p className="text-[#666] text-[13px] mb-7">Admin access only.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#888] text-[12px] font-medium mb-1.5 tracking-wide uppercase">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#444] focus:outline-none focus:border-[#FF2D1A] transition-colors"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-[#888] text-[12px] font-medium mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[14px] placeholder-[#444] focus:outline-none focus:border-[#FF2D1A] transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <p className="text-[#FF2D1A] text-[13px] bg-[#FF2D1A]/10 border border-[#FF2D1A]/20 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF2D1A] hover:bg-[#e02718] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[14px] rounded-lg py-2.5 transition-colors mt-2"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#3a3a3a] text-[12px] mt-6">
          Spotlight Security Group Inc.
        </p>
      </div>
    </div>
  );
}
