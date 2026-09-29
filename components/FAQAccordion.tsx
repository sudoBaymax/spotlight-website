"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Does this replace my ISA?",
    a: "Not necessarily. Spotlight handles the first 60-second window — where most teams lose leads because no human can respond that fast reliably. If you have an ISA, they shift from racing to answer phones to handling warm follow-up on qualified leads. Some teams reduce ISA headcount after 90 days. That's your call. We'll show you the numbers.",
  },
  {
    q: "What CRMs does Spotlight connect to?",
    a: "Follow Up Boss, kvCORE, Sierra Interactive, LionDesk, CINC, and most major real estate CRMs via API or webhook. We confirm compatibility during your audit call. If your CRM isn't on the standard list, we'll tell you before you commit to anything.",
  },
  {
    q: "Will my leads know it's AI?",
    a: "Spotlight introduces itself as part of your team's system — it does not pose as a specific named agent. We don't fake a human identity. Most leads care about speed and relevance, not who reached out. The exact wording is yours to review before go-live.",
  },
  {
    q: "How fast are we live?",
    a: "14 days from kickoff. Week one: setup, CRM integration, and custom script build. Week two: testing and go-live with active monitoring. We stay on it through the first full week of live traffic and send you a performance report.",
  },
  {
    q: "Do I have to change my lead sources?",
    a: "No. Spotlight connects to your existing Zillow, Google, Facebook, and website leads through your current CRM or lead routing setup. Your lead sources stay exactly as they are.",
  },
  {
    q: "What if my team already has a dialer?",
    a: "Dialers require a human to initiate. Spotlight operates with no human in the loop for first contact, 24 hours a day. Your dialer still handles structured follow-up sequences. Spotlight owns the 60-second first-contact window.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-[#E8E8E8]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left py-5 flex items-center justify-between gap-8 group"
            aria-expanded={open === i}
          >
            <span className="text-[15px] text-[#111] font-medium leading-snug group-hover:text-[#333]">
              {faq.q}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              stroke="#AAA" strokeWidth="1.5" strokeLinecap="round"
              className={`flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
            >
              <path d="M2 5l5 5 5-5" />
            </svg>
          </button>
          {open === i && (
            <div className="pb-5 text-[14px] text-[#667780] leading-relaxed max-w-2xl">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
