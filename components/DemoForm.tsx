"use client";

import { useState, useRef, useEffect } from "react";

const useCases = [
  "Buyer lead — Zillow",
  "Buyer lead — Google / Facebook",
  "Buyer lead — website",
  "Seller lead — any source",
];

export default function DemoForm() {
  const [form, setForm] = useState({ useCase: "", name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center gap-4">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 7l3 3 6-6" />
          </svg>
        </div>
        <p className="text-[#111] font-semibold text-[16px]">You&apos;ll get a call shortly.</p>
        <p className="text-muted text-[13px] max-w-xs leading-relaxed">
          Our AI will call you within the next few minutes using a script built for{" "}
          {form.useCase || "your use case"}.
        </p>
      </div>
    );
  }

  const fieldCls = "w-full bg-transparent border-0 border-b border-[#D0D0D0] focus:border-[#111] outline-none text-[#111] text-[15px] py-3 transition-colors placeholder:text-[#bbb]";
  const labelCls = "block text-[11px] font-semibold text-accent tracking-[0.14em] uppercase mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* Custom Use Case dropdown */}
      <div>
        <label className={labelCls}>Use case</label>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(o => !o)}
            className="w-full bg-transparent border-0 border-b border-[#D0D0D0] hover:border-[#111] outline-none text-[15px] py-3 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className={form.useCase ? "text-[#111]" : "text-[#bbb]"}>
              {form.useCase || "Select your lead type"}
            </span>
            {/* Chevron */}
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              stroke="#999" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
              className={`flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            >
              <path d="M2 5l5 5 5-5" />
            </svg>
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#EBEBEB] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
              {useCases.map((u, i) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, useCase: u })); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-[14px] text-[#111] hover:bg-[#F5F5F5] transition-colors ${
                    i < useCases.length - 1 ? "border-b border-[#F0F0F0]" : ""
                  } ${form.useCase === u ? "font-medium" : ""}`}
                >
                  {u}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className={labelCls}>Name</label>
        <input required type="text" placeholder="Your Name"
          value={form.name} onChange={set("name")} className={fieldCls} />
      </div>

      <div>
        <label className={labelCls}>Phone number</label>
        <input required type="tel" placeholder="+1 555 123 4567"
          value={form.phone} onChange={set("phone")} className={fieldCls} />
      </div>

      <button type="submit" className="btn-dark w-full justify-center py-3.5 text-[14px] mt-2">
        Get a call
      </button>

      <p className="text-[#ccc] text-[11px] text-center">
        You&apos;ll receive a live AI call. Takes under 2 minutes.
      </p>
    </form>
  );
}
