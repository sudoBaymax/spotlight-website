"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    teamName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wire to your form backend (Resend, Formspree, etc.)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-2xl p-10 flex flex-col items-start justify-center min-h-[360px]">
        <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8l3 3 7-7" />
          </svg>
        </div>
        <h2 className="text-text-primary font-semibold text-xl mb-2">
          Message received.
        </h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-xs">
          We&apos;ll get back to you the same day. If you want a faster answer,
          book an audit call — we respond live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-text-muted text-[13px] font-medium mb-1.5"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Sarah Reeves"
            className="w-full bg-bg-card border border-bg-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="teamName"
            className="block text-text-muted text-[13px] font-medium mb-1.5"
          >
            Team name
          </label>
          <input
            id="teamName"
            name="teamName"
            type="text"
            value={form.teamName}
            onChange={handleChange}
            placeholder="The Reeves Group"
            className="w-full bg-bg-card border border-bg-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="email"
            className="block text-text-muted text-[13px] font-medium mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="sarah@reedgroup.com"
            className="w-full bg-bg-card border border-bg-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-text-muted text-[13px] font-medium mb-1.5"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
            className="w-full bg-bg-card border border-bg-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-text-muted text-[13px] font-medium mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="We're running a 12-agent team and want to know if Spotlight works with kvCORE..."
          className="w-full bg-bg-card border border-bg-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn-primary py-3.5 px-7 text-[15px] w-full sm:w-auto"
      >
        Send message
      </button>
    </form>
  );
}
