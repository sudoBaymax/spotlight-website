import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import DemoForm from "@/components/DemoForm";
import TalksLikeISA from "@/components/TalksLikeISA";
import BuiltToConvert from "@/components/BuiltToConvert";
import ChannelCascade from "@/components/ChannelCascade";
import HowItWorksSection from "@/components/HowItWorksSection";

// ─── Shared primitives ────────────────────────────────────────────────────────

/** Retell-style gradient orb — used in hero CTA card + demo section */
function Orb({ size = 220 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `
          radial-gradient(circle at 38% 32%, rgba(100,140,220,0.8) 0%, transparent 40%),
          radial-gradient(circle at 65% 60%, rgba(30,100,120,0.7) 0%, transparent 42%),
          radial-gradient(circle at 25% 70%, rgba(60,30,80,0.5) 0%, transparent 45%),
          #0c1020
        `,
      }}
    />
  );
}

/** Animated orbit dots — Retell-style section divider */
function OrbitDots({ px = 120 }: { px?: number }) {
  const r = px * 0.37;
  const dots: Array<{ sz: number; angle: number }> = [
    { sz: 10, angle: 0 }, { sz: 8,  angle: 45 }, { sz: 11, angle: 90 },
    { sz: 7,  angle: 135},{ sz: 9,  angle: 180}, { sz: 7,  angle: 225},
    { sz: 10, angle: 270}, { sz: 6, angle: 315},
  ];
  return (
    <div className="relative flex-shrink-0" style={{ width: px, height: px }} aria-hidden>
      <div className="absolute inset-0 animate-orbit">
        {dots.map((d, i) => {
          const rad = (d.angle * Math.PI) / 180;
          const cx  = px / 2 + r * Math.cos(rad);
          const cy  = px / 2 + r * Math.sin(rad);
          return (
            <div key={i} className="absolute rounded-full bg-[#2d3748]"
              style={{ width: d.sz, height: d.sz, left: cx - d.sz / 2, top: cy - d.sz / 2 }} />
          );
        })}
      </div>
    </div>
  );
}

// ─── 1. HERO ──────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white pt-[68px] pb-8 px-[2.5vw]">
      {/* Floating gradient card — 95vw, centered, rounded-[50px] */}
      <div
        className="relative flex flex-col mx-auto overflow-hidden"
        style={{
          width: "95vw",
          minHeight: "calc(100vh - 80px - 32px)",
          borderRadius: "50px",
          background: `
            radial-gradient(ellipse 72% 60% at 30% 28%, rgba(26,58,168,0.88) 0%, transparent 52%),
            radial-gradient(ellipse 55% 48% at 70% 72%, rgba(6,78,59,0.75) 0%, transparent 52%),
            radial-gradient(ellipse 28% 22% at 80% 14%, rgba(30,18,70,0.45) 0%, transparent 60%),
            #050A12
          `,
        }}
      >
        {/* Center content — headline only */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-white text-[15px] font-semibold tracking-[0.18em] uppercase mb-8 md:mb-10">
            #1 Speed-to-lead system for real estate teams
          </p>
          <h1
            className="font-serif font-light text-white leading-[1.01] tracking-[-0.025em] max-w-[900px]"
            style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
          >
            Your leads are already paid for.
            <br />
            Answer them in{" "}
            <em style={{ fontStyle: "italic" }}>60 seconds.</em>
          </h1>
        </div>

        {/* Bottom bar */}
        <div className="px-10 pb-10 md:pb-14 flex flex-row items-center justify-between gap-6">
          {/* Left stat */}
          <p className="text-white text-[15px] font-medium leading-relaxed max-w-[220px]">
            Built for teams buying internet leads from Zillow, Google, and Facebook.
            Live in 14 days.
          </p>

          {/* Center — Book audit CTA */}
          <Link
            href="/audit"
            className="btn-dark px-8 py-4 text-[15px] flex-shrink-0"
          >
            Book a free audit →
          </Link>

          {/* Right — video CTA card */}
          <Link
            href="/audit"
            className="group flex items-center gap-4 bg-[#0d1526]/80 hover:bg-[#0d1526] border border-white/10 hover:border-white/20 backdrop-blur-md rounded-2xl px-6 py-5 transition-all duration-200 flex-shrink-0"
          >
            <div>
              <p className="text-white font-semibold text-[18px] leading-snug">
                Hear a 60-second
                <br />
                lead response
              </p>
              <p className="text-white/50 text-[12px] mt-1.5">Tap to hear live AI →</p>
            </div>
            <video
              src="/ai_orb.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="flex-shrink-0 w-[72px] h-[72px] rounded-xl object-cover"
              style={{ filter: "hue-rotate(-20deg) saturate(2) brightness(1.1) sepia(0.25)" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}


// ─── 3. PROOF MODULE — "Hear a 60-second response" ───────────────────────────

function ProofModule() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="section-container">
        <h2
          className="font-serif font-light text-[#111] text-center mb-12 md:mb-16 leading-tight"
          style={{ fontSize: "clamp(48px, 8.5vw, 130px)" }}
        >
          Hear a 60-second
          <br />
          lead response
        </h2>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5 max-w-[1200px] mx-auto">
          {/* Left — orb video panel with border */}
          <div className="border border-[#E8E8E8] rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center min-h-[480px] gap-8">
            <video
              src="/ai_orb.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-[320px] h-[320px] object-cover rounded-full"
              style={{ filter: "hue-rotate(-20deg) saturate(2) brightness(1.1) sepia(0.25)" }}
            />
            <div className="flex flex-wrap justify-center gap-2">
              {["Buyer lead", "Seller lead", "Zillow", "Website lead"].map(tag => (
                <span key={tag}
                  className="text-[#444] text-[13px] font-medium px-4 py-2 rounded-full border border-[#E8E8E8]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — form with light grey background */}
          <div className="bg-[#F4F4F4] rounded-2xl p-10 md:p-14">
            <p className="text-[#111] text-[20px] font-medium leading-snug mb-2">
              Receive a live call from our AI
            </p>
            <p className="text-muted text-[15px] leading-relaxed mb-10">
              Hear exactly how Spotlight responds to a new lead on your team — before you buy anything.
            </p>
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. PROBLEM — stat cards ─────────────────────────────────────────────────

function Problem() {
  const stats = [
    {
      stat: "40",
      unit: "min",
      heading: "Average time to first contact",
      body: "By then, a competing agent has already had the conversation.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="9" />
          <path d="M11 6v5l3 3" />
        </svg>
      ),
    },
    {
      stat: "#1",
      unit: "",
      heading: "First caller wins the appointment",
      body: "Speed isn&apos;t a differentiator — it&apos;s the entire decision.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 3l2.1 6.4H19l-5.4 3.9 2.1 6.4L11 15.8l-4.7 3.9 2.1-6.4L3 9.4h5.9L11 3z" />
        </svg>
      ),
    },
    {
      stat: "$0",
      unit: "",
      heading: "Refunded for late responses",
      body: "Every slow response is money already spent that never comes back.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="9" />
          <path d="M11 7v1m0 6v1M9 9.5a2 2 0 013.5 1.3c0 1.5-2.5 1.7-2.5 3.2h2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white py-16 md:py-28">
      <div className="section-container">
        <div className="mb-12 md:mb-16">
          <p className="eyebrow text-muted mb-5">The problem</p>
          <h2
            className="font-serif font-light text-[#111] leading-tight max-w-[540px]"
            style={{ fontSize: "clamp(30px, 4vw, 54px)" }}
          >
            Why most internet leads never become appointments.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {stats.map((s) => (
            <div key={s.stat} className="bg-[#F4F4F4] rounded-2xl p-8 md:p-10 flex flex-col min-h-[300px]">
              {/* Icon */}
              <div className="mb-6">{s.icon}</div>

              {/* Big stat */}
              <div className="mb-auto">
                <span
                  className="font-serif font-light text-[#111] leading-none"
                  style={{ fontSize: "clamp(60px, 6.5vw, 88px)" }}
                >
                  {s.stat}
                </span>
                {s.unit && (
                  <span className="text-[#888] text-[22px] font-light ml-2">{s.unit}</span>
                )}
              </div>

              {/* Label + body */}
              <div className="mt-8">
                <p className="text-[#111] font-semibold text-[14px] mb-1.5">{s.heading}</p>
                <p className="text-muted text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/audit" className="btn-dark px-5 py-2.5 text-[13px]">
            See what your team&apos;s response time is costing you
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── 8. OFFER STACK + GUARANTEE ───────────────────────────────────────────────

function OfferSection() {
  const deliverables = [
    { n: "1", t: "Response-time audit",   d: "We map your lead sources and show exactly where response time is failing. You leave with a number." },
    { n: "2", t: "Custom AI scripts",     d: "Written for your market, your team, and your lead types. Not a template." },
    { n: "3", t: "CRM integration",       d: "Full connection to Follow Up Boss, kvCORE, or your CRM. Every field tested before go-live." },
    { n: "4", t: "Live AI responder",     d: "Active on all connected lead sources. 24/7. No human in the loop for first contact." },
    { n: "5", t: "30-day performance tracking", d: "Weekly numbers for your first month — response time, contact rate, appointments booked." },
  ];

  return (
    <section className="bg-card py-16 md:py-28">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <p className="eyebrow text-muted mb-5">What you get</p>
            <h2
              className="font-serif font-light text-[#111] leading-tight mb-6"
              style={{ fontSize: "clamp(28px, 3.8vw, 50px)" }}
            >
              Everything to go live in 14 days. We install it. You run appointments.
            </h2>
            <p className="text-muted text-[15px] leading-relaxed mb-8">
              This isn&apos;t a 90-day transformation. It&apos;s a working system by week two.
              We don&apos;t hand you a manual.
            </p>
            <Link href="/audit" className="btn-dark px-5 py-3">
              Book a 15-minute lead audit
            </Link>

            {/* Guarantee callout */}
            <div className="mt-8 border border-card-b rounded-2xl p-5 bg-white">
              <p className="text-[#111] font-semibold text-[14px] mb-1.5">14-day response guarantee</p>
              <p className="text-muted text-[13px] leading-relaxed">
                If connected internet leads are not answered in under 60 seconds within 14 days of access,
                setup is not due. No exceptions.
              </p>
            </div>
          </div>

          <div className="space-y-0">
            {deliverables.map((d, i) => (
              <div key={d.n}
                className={`flex gap-5 py-5 ${i < deliverables.length - 1 ? "border-b border-card-b" : ""}`}>
                <div className="flex-shrink-0 w-7 h-7 bg-white border border-card-b rounded-lg flex items-center justify-center">
                  <span className="text-accent font-mono text-[11px] font-bold">{d.n}</span>
                </div>
                <div>
                  <p className="text-[#111] font-semibold text-[14px] mb-1">{d.t}</p>
                  <p className="text-muted text-[13px] leading-relaxed">{d.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 10. FAQ ──────────────────────────────────────────────────────────────────

function FAQSection() {
  return (
    <section className="bg-white py-16 md:py-28">
      <div className="section-container">
        <div className="mb-12">
          <p className="eyebrow text-muted mb-5">FAQ</p>
          <h2
            className="font-serif font-light text-[#111] leading-tight"
            style={{ fontSize: "clamp(34px, 5vw, 68px)" }}
          >
            Questions team leaders ask
          </h2>
        </div>
        <div className="max-w-3xl">
          <FAQAccordion />
        </div>
        <div className="mt-8">
          <Link href="/faq" className="text-muted hover:text-[#111] text-[13px] transition-colors">
            View all questions →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── 11. FINAL CTA ────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden min-h-[500px] flex items-center">
      {/* Dark gradient background — full bleed */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 65% 60% at 30% 55%, rgba(26,58,168,0.75) 0%, transparent 52%),
            radial-gradient(ellipse 50% 45% at 72% 38%, rgba(6,78,59,0.65) 0%, transparent 52%),
            #050A12
          `,
        }}
      />

      <div className="relative z-10 section-container py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          {/* Left */}
          <div className="max-w-[520px]">
            <h2
              className="font-serif font-light text-white leading-tight mb-5"
              style={{ fontSize: "clamp(34px, 4.5vw, 60px)" }}
            >
              Stop leaving appointments on the table.
            </h2>
            <p className="text-white/45 text-[15px] leading-relaxed">
              We&apos;ll audit your lead sources and response times in 15 minutes.
              You leave with a revenue number and a clear answer on whether
              Spotlight is a fit.
            </p>
          </div>

          {/* Right — white card */}
          <div className="bg-white rounded-2xl p-7 md:p-9 w-full lg:w-[320px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-5">
              <Orb size={40} />
              <p className="text-[#111] font-semibold text-[15px] leading-snug">
                Book your free lead audit
              </p>
            </div>
            <p className="text-muted text-[13px] leading-relaxed mb-7">
              No commitment. 15 minutes. You leave with a specific revenue-at-risk number.
            </p>
            <Link href="/audit"
              className="btn-dark w-full justify-center py-3.5 text-[14px] mb-3">
              Book the audit call
            </Link>
            <Link href="/how-it-works"
              className="btn-outline w-full justify-center py-3 text-[13px]">
              See how it works first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Hero />
      <BuiltToConvert />
      <ProofModule />
      <Problem />
      <HowItWorksSection />
      <TalksLikeISA />
      <ChannelCascade />
      <OfferSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
