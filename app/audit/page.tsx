import type { Metadata } from "next";
import AuditForm from "./AuditForm";

export const metadata: Metadata = {
  title: "Book a Lead Audit | Spotlight",
  description:
    "Free 15-minute audit of your team's lead sources, response times, and monthly volume. You leave with a revenue number.",
};

const points = [
  "We review your current lead sources and monthly volume",
  "We show you exactly where response time is failing",
  "You get a revenue-at-risk number based on your actual data",
  "If Spotlight isn't a fit, we'll tell you",
];

export default function AuditPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-[#E8E8E8] pt-28 pb-14 md:pt-36 md:pb-16">
        <div className="section-container">
          <p className="eyebrow text-muted mb-5">Free lead audit</p>
          <h1
            className="font-serif font-light text-[#111] leading-tight mb-5 max-w-2xl"
            style={{ fontSize: "clamp(38px, 5.5vw, 72px)" }}
          >
            See exactly what slow response is costing your team.
          </h1>
          <p className="text-muted text-[16px] leading-relaxed max-w-md">
            15 minutes. We audit your lead sources, response times, and monthly
            volume. You leave with a specific number — not a sales pitch.
          </p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="bg-white py-14 md:py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 max-w-4xl">

            {/* Form */}
            <div>
              <h2 className="text-[#111] font-semibold text-[16px] mb-8">Tell us about your team</h2>
              <AuditForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* What happens */}
              <div className="bg-card rounded-2xl p-6">
                <p className="text-[#111] font-semibold text-[13px] mb-4">On the audit call</p>
                <ul className="space-y-3">
                  {points.map(p => (
                    <li key={p} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 w-4 h-4 border border-[#D0CCD8] rounded-full flex items-center justify-center">
                        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 3.5l1.5 1.5 3.5-3" />
                        </svg>
                      </div>
                      <span className="text-muted text-[12px] leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantee */}
              <div className="bg-card rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white border border-[#E8E8E8] rounded-lg flex items-center justify-center mt-0.5">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#888" strokeWidth="1.3" strokeLinecap="round">
                      <path d="M6.5 1L1.5 3.5v3C1.5 9.8 3.8 12.4 6.5 13c2.7-.6 5-3.2 5-6.5v-3L6.5 1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#111] font-semibold text-[12px] mb-1">14-day response guarantee</p>
                    <p className="text-muted text-[11px] leading-relaxed">
                      If we don&apos;t get your leads answered in under 60 seconds within 14 days, setup is not due.
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="px-1">
                <p className="text-[#CCC] text-[12px] leading-relaxed">
                  We confirm a time within 1 business day. The audit takes 15 minutes by video or phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-card border-t border-card-b py-12">
        <div className="section-container max-w-xl">
          <p className="text-muted text-[12px] font-semibold tracking-wider uppercase mb-4">This audit is for</p>
          <ul className="space-y-2">
            {[
              "Team leaders running 6+ agents who buy internet leads",
              "Teams spending $3k–$20k+/month on Zillow, Google, or Facebook leads",
              "Anyone who suspects they're losing appointments to slow response",
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-[#888] text-[13px]">
                <span className="mt-1.5 w-1 h-1 bg-[#CCC] rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
