import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works | Spotlight",
  description:
    "See exactly how Spotlight responds to a real estate lead in under 60 seconds, qualifies them, and books the appointment.",
};

const steps = [
  {
    n:    "01",
    head: "Lead arrives from Zillow, Google, Facebook, or your website",
    body: [
      "A new lead submits their contact info anywhere you advertise. It enters your CRM exactly as it does today. Nothing about your lead sources changes.",
      "Spotlight monitors all connected lead sources in real time. The moment a new lead lands, the clock starts.",
    ],
    note: "Integrates with Follow Up Boss, kvCORE, Sierra Interactive, LionDesk, CINC, and most major real estate CRMs.",
  },
  {
    n:    "02",
    head: "Spotlight responds by text and voice in under 60 seconds",
    body: [
      "The AI sends a text message and places a call to the lead — within 60 seconds of submission. Not within the hour. Not the next morning. 60 seconds.",
      "This works at 8 AM, at 10 PM, on Saturday, and during every listing appointment your agents are sitting in.",
    ],
    note: "No human in the loop for the first contact. Your agents are notified when a lead responds and is qualified.",
  },
  {
    n:    "03",
    head: "AI qualifies with four questions",
    body: [
      "The AI is scripted specifically for your team and market. Buying or selling? Timeline? Area? Price range?",
      "Those four data points are enough to know whether the lead is worth a showing appointment. The conversation sounds like your team — not a call center.",
    ],
    note: "Scripts are customized during setup. Buyer, seller, and rental scripts are all supported.",
  },
  {
    n:    "04",
    head: "Appointment booked. CRM updated. Agent notified.",
    body: [
      "If the lead qualifies, Spotlight books the appointment and writes a complete contact note back to your CRM: name, phone, email, status, timeline, area, price range.",
      "Your agent walks into the appointment knowing exactly who they're meeting and what they want.",
    ],
    note: "Appointments can route to a specific agent, round-robin, or hold for team leader assignment.",
  },
];

const stats = [
  { val: "< 60s", label: "Response time, every time" },
  { val: "14",    label: "Days to go live"            },
  { val: "24/7",  label: "Active coverage"            },
  { val: "4",     label: "Qualification questions"    },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-[#E8E8E8] pt-28 pb-14 md:pt-36 md:pb-16">
        <div className="section-container">
          <p className="eyebrow text-muted mb-5">How it works</p>
          <h1
            className="font-serif font-light text-[#111] leading-tight mb-5 max-w-2xl"
            style={{ fontSize: "clamp(38px, 5.5vw, 72px)" }}
          >
            From lead submission to booked appointment.
          </h1>
          <p className="text-muted text-[16px] leading-relaxed max-w-lg mb-8">
            Four steps. No human required for the first contact. Every lead, every time.
          </p>
          <Link href="/audit" className="btn-dark px-5 py-3">
            Book a 15-minute lead audit
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-card border-b border-card-b py-10">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-serif font-light text-[#111] text-3xl md:text-4xl mb-1">{s.val}</p>
                <p className="text-muted text-[13px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white py-16 md:py-28">
        <div className="section-container">
          <div className="space-y-5 max-w-3xl">
            {steps.map(step => (
              <div key={step.n} className="bg-card rounded-2xl p-7 md:p-9">
                <div className="flex items-start gap-5">
                  <span className="font-mono text-[11px] text-muted tracking-widest flex-shrink-0 mt-1">
                    {step.n}
                  </span>
                  <div>
                    <h2 className="text-[#111] font-semibold text-[17px] md:text-[19px] leading-snug mb-4">
                      {step.head}
                    </h2>
                    {step.body.map((p, j) => (
                      <p key={j} className="text-muted text-[14px] leading-relaxed mb-3 last:mb-0">{p}</p>
                    ))}
                    {step.note && (
                      <div className="mt-5 pt-4 border-t border-card-b">
                        <p className="text-[#bbb] text-[12px] leading-relaxed">{step.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRM list */}
      <section className="bg-card border-t border-card-b py-12">
        <div className="section-container text-center">
          <p className="text-muted text-[13px] mb-4">Connects to your existing CRM</p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            {["Follow Up Boss","kvCORE","Sierra Interactive","LionDesk","CINC","+ more via API"].map(crm => (
              <span key={crm} className="text-[#CCC] text-[13px] font-medium">{crm}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-[#E8E8E8] py-16 md:py-24">
        <div className="section-container max-w-xl">
          <h2
            className="font-serif font-light text-[#111] leading-tight mb-5"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            Ready to see what your team&apos;s response time is costing you?
          </h2>
          <p className="text-muted text-[15px] leading-relaxed mb-8">
            15-minute audit. You leave with a revenue number and a clear
            answer on whether Spotlight is a fit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/audit"   className="btn-dark px-5 py-3">Book a 15-minute audit</Link>
            <Link href="/pricing" className="btn-outline px-5 py-3">See pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
