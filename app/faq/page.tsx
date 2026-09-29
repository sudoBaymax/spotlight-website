import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ | Spotlight",
  description: "Answers to the questions real estate team leaders ask before signing on with Spotlight.",
};

const extra: { q: string; a: string }[] = [
  {
    q: "What does the setup process actually look like?",
    a: "Audit call first. From there, it's script writing, CRM connection, and testing — 14 days. We stay on it through the first full week of live traffic and send you performance numbers.",
  },
  {
    q: "How is this different from an ISA service?",
    a: "ISA services use humans who work business hours and take sick days. Spotlight operates 24/7 with no turnover and no response-time variance. ISAs are useful for warm follow-up. Spotlight owns the 60-second first-contact window.",
  },
  {
    q: "What if we already use a specific lead routing tool?",
    a: "We integrate at the CRM layer, not the lead router layer. Most lead routing tools push leads to your CRM — that's where Spotlight picks them up. We'll confirm compatibility on the audit call.",
  },
  {
    q: "Is there a contract?",
    a: "No 12-month lock-in. If connected internet leads are not answered in under 60 seconds within 14 days of access, setup is not due. After that, it's month-to-month.",
  },
  {
    q: "What happens to leads that don't qualify?",
    a: "They still get the initial response and attempted qualification. Non-qualifying leads are tagged in your CRM and can flow into your normal nurture sequences.",
  },
  {
    q: "Do I need to buy new software?",
    a: "No. Spotlight sits on top of your existing CRM and lead sources. You don't replace anything — you add a layer that handles first response.",
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-[#E8E8E8] pt-28 pb-14 md:pt-36 md:pb-16">
        <div className="section-container">
          <p className="eyebrow text-muted mb-5">FAQ</p>
          <h1
            className="font-serif font-light text-[#111] leading-tight max-w-2xl"
            style={{ fontSize: "clamp(38px, 6vw, 80px)" }}
          >
            Questions team leaders ask
          </h1>
        </div>
      </section>

      {/* Core FAQ */}
      <section className="bg-white py-14 md:py-20">
        <div className="section-container max-w-3xl">
          <FAQAccordion />
        </div>
      </section>

      {/* Extended Q&A */}
      <section className="bg-card border-t border-card-b py-14 md:py-20">
        <div className="section-container max-w-3xl">
          <p className="eyebrow text-muted mb-8">More questions</p>
          <div className="space-y-0">
            {extra.map((item, i) => (
              <div key={i}
                className={`py-6 ${i < extra.length - 1 ? "border-b border-card-b" : ""}`}>
                <h3 className="text-[#111] font-semibold text-[15px] mb-2">{item.q}</h3>
                <p className="text-muted text-[14px] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-[#E8E8E8] py-16 md:py-24">
        <div className="section-container max-w-lg">
          <h2
            className="font-serif font-light text-[#111] leading-tight mb-5"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            Still have questions? Book a 15-minute call.
          </h2>
          <p className="text-muted text-[15px] leading-relaxed mb-8">
            We&apos;ll answer everything specific to your team, lead sources, and CRM.
            No pitch — just answers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/audit"   className="btn-dark px-5 py-3">Book an audit call</Link>
            <Link href="/contact" className="btn-outline px-5 py-3">Send a message</Link>
          </div>
        </div>
      </section>
    </>
  );
}
