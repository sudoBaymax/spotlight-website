"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STEP_DURATION = 4000; // ms each step is shown
const FADE_MS       = 350;  // ms for fade in/out

const steps = [
  {
    n: "01",
    heading: "Lead arrives",
    body: "A new lead submits through Zillow, Google, Facebook, or your website.",
  },
  {
    n: "02",
    heading: "Spotlight responds in under 60 seconds",
    body: "AI sends a text and places a call — every lead, every day, including 11 PM Saturday.",
  },
  {
    n: "03",
    heading: "Four qualification questions",
    body: "Buying or selling? Timeline? Area? Price range? Enough to decide whether the lead is worth a showing appointment.",
  },
  {
    n: "04",
    heading: "Appointment booked. CRM updated.",
    body: "Qualified leads are booked and written back to Follow Up Boss, kvCORE, or your CRM with a full contact note.",
  },
];

/* ── Right-panel UI screens ─────────────────────────────────────────────── */

function LeadArrivesScreen() {
  return (
    <div className="bg-white rounded-2xl border border-card-b p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full block animate-pulse" />
          <span className="text-[11px] font-semibold text-muted tracking-wider uppercase">New lead</span>
        </div>
        <span className="text-[11px] text-muted">Just now</span>
      </div>

      <div className="bg-[#F4F4F4] rounded-xl p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[#111] font-semibold text-[14px]">Michael Torres</p>
            <p className="text-muted text-[12px]">Interested in buying · Scottsdale, AZ</p>
          </div>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">Zillow</span>
        </div>
        <p className="text-[#666] text-[12px] mt-2 italic">&ldquo;3BR homes under $650k, pre-approved&rdquo;</p>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted">
        <div className="flex-1 h-px bg-card-b" />
        Landed in CRM · awaiting response
        <div className="flex-1 h-px bg-card-b" />
      </div>
    </div>
  );
}

function RespondingScreen() {
  return (
    <div className="bg-white rounded-2xl border border-card-b p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted tracking-wider uppercase">Spotlight responding</span>
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">Live</span>
      </div>

      {/* Timer ring */}
      <div className="flex justify-center py-2">
        <div className="relative w-[88px] h-[88px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" fill="none" stroke="#f0f0f0" strokeWidth="5" />
            <circle cx="44" cy="44" r="36" fill="none" stroke="#0f1a2e" strokeWidth="5"
              strokeDasharray="226" strokeDashoffset="57" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-bold text-[20px] text-[#111]">0:38</span>
            <span className="text-[9px] text-muted">seconds</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {[
          {
            label: "Call placed to Michael Torres",
            done: true,
            icon: (
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 11.5c-.7-.7-1.5-.7-2.2 0l-1 1c-1.5-.8-2.8-2.1-3.6-3.6l1-1c.7-.7.7-1.5 0-2.2L7.2 4.2c-.7-.7-1.7-.7-2.3 0L3.8 5.3C3 6.1 3 7.4 3.8 8.2 5.7 10.9 7.1 12.3 9.8 14.2c.8.8 2.1.8 2.9 0l1.1-1.1c.7-.6.7-1.6-.3-1.6z" />
              </svg>
            ),
          },
          {
            label: "SMS sent with follow-up",
            done: true,
            icon: (
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3H3a1 1 0 00-1 1v8a1 1 0 001 1h5l3 3v-3h4a1 1 0 001-1V4a1 1 0 00-1-1z" />
              </svg>
            ),
          },
          {
            label: "Qualifying lead…",
            done: false,
            icon: (
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="7" />
                <path d="M9 6v3l2 2" />
              </svg>
            ),
          },
        ].map((item) => (
          <div key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] ${
              item.done ? "bg-green-50 text-green-700" : "bg-[#F4F4F4] text-muted"
            }`}>
            <span className={item.done ? "text-green-600" : "text-muted"}>{item.icon}</span>
            {item.label}
            {item.done && (
              <svg className="ml-auto flex-shrink-0" width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7l3 3 6-6" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QualificationScreen() {
  const messages = [
    { from: "ai",   text: "Hi Michael! I'm with the Johnson Team. Are you looking to buy or sell?" },
    { from: "lead", text: "Buy" },
    { from: "ai",   text: "Great — what's your timeline? 30, 60, or 90 days?" },
    { from: "lead", text: "30 days, need to move fast" },
    { from: "ai",   text: "What's your price range?" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-card-b p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold text-muted tracking-wider uppercase">Live qualification</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full block animate-pulse" />
          <span className="text-[11px] text-muted">Michael Torres</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "ai" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-[12px] leading-snug ${
              m.from === "ai"
                ? "bg-[#F0F0F4] text-[#333] rounded-tl-sm"
                : "bg-[#0f1a2e] text-white rounded-tr-sm"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        <div className="flex justify-start">
          <div className="bg-[#F0F0F4] px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
            {[0, 150, 300].map(d => (
              <span key={d} className="w-1.5 h-1.5 bg-[#aaa] rounded-full block animate-bounce"
                style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookedScreen() {
  return (
    <div className="bg-white rounded-2xl border border-card-b p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 7l3 3 6-6" />
          </svg>
        </div>
        <div>
          <p className="text-[#111] font-semibold text-[14px]">Appointment booked</p>
          <p className="text-muted text-[11px]">Responded in 38 seconds</p>
        </div>
      </div>

      <div className="bg-[#F4F4F4] rounded-xl p-4">
        <p className="text-[10px] font-semibold text-muted tracking-wider uppercase mb-2.5">Thursday</p>
        <div className="flex gap-3 items-center">
          <div className="w-1 h-14 bg-[#0f1a2e] rounded-full flex-shrink-0" />
          <div>
            <p className="text-[#111] font-semibold text-[13px]">Buyer Consultation</p>
            <p className="text-muted text-[11px] mt-0.5">2:00 PM – 2:45 PM</p>
            <p className="text-muted text-[11px]">Michael Torres</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {[
          "Follow Up Boss — contact note written",
          "kvCORE — lead status updated to qualified",
        ].map(s => (
          <div key={s} className="flex items-center gap-2 text-[12px] text-[#555]">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7l3 3 6-6" />
            </svg>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

const SCREENS = [LeadArrivesScreen, RespondingScreen, QualificationScreen, BookedScreen];

/* ── Main component ─────────────────────────────────────────────────────── */

export default function HowItWorksSection() {
  const [active, setActive]           = useState(0);
  const [fading, setFading]           = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Reset and start progress bar whenever active changes
  useEffect(() => {
    setFading(false);
    setProgressWidth(0);
    const ptStart = setTimeout(() => setProgressWidth(100), 50);
    const ftStart = setTimeout(() => setFading(true), STEP_DURATION - FADE_MS);
    const next    = setTimeout(() => setActive(a => (a + 1) % steps.length), STEP_DURATION);
    return () => {
      clearTimeout(ptStart);
      clearTimeout(ftStart);
      clearTimeout(next);
    };
  }, [active]);

  const handleClick = (i: number) => {
    if (i === active) return;
    setFading(true);
    setTimeout(() => setActive(i), FADE_MS);
  };

  const Screen = SCREENS[active];

  return (
    <section className="bg-card py-16 md:py-28">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left: steps */}
          <div>
            <p className="eyebrow text-muted mb-5">How a lead gets locked</p>
            <h2
              className="font-serif font-light text-[#111] leading-tight mb-10"
              style={{ fontSize: "clamp(28px, 3.8vw, 50px)" }}
            >
              From lead arrival to booked appointment. No human required for first contact.
            </h2>

            <div>
              {steps.map((s, i) => (
                <button
                  key={s.n}
                  onClick={() => handleClick(i)}
                  className={`w-full text-left flex gap-5 py-5 relative transition-opacity duration-300 ${
                    i < steps.length - 1 ? "border-b border-card-b" : ""
                  } ${i === active ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                >
                  {/* Progress bar on active step */}
                  {i === active && (
                    <div className="absolute bottom-0 left-0 h-[2px] bg-[#111] rounded-full transition-none"
                      style={{
                        width: `${progressWidth}%`,
                        transition: progressWidth === 0
                          ? "none"
                          : `width ${STEP_DURATION - 50}ms linear`,
                      }}
                    />
                  )}

                  <span className="font-mono text-[11px] text-muted tracking-widest flex-shrink-0 mt-0.5">
                    {s.n}
                  </span>
                  <div>
                    <p className={`font-semibold text-[15px] mb-1 ${i === active ? "text-[#111]" : "text-[#555]"}`}>
                      {s.heading}
                    </p>
                    {i === active && (
                      <p className="text-muted text-[13px] leading-relaxed">{s.body}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: animated screen */}
          <div className="md:sticky md:top-24">
            <div
              style={{
                opacity:    fading ? 0 : 1,
                transform:  fading ? "translateY(10px)" : "translateY(0)",
                transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
              }}
            >
              <Screen />
            </div>
          </div>

        </div>

        <div className="mt-12">
          <Link href="/audit" className="btn-dark px-5 py-2.5 text-[13px]">
            Book a free lead audit
          </Link>
        </div>
      </div>
    </section>
  );
}
