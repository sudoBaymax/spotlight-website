import Link from "next/link";

const tiers = [
  {
    name: "Founding 5",
    tag: "Limited spots",
    setup: "$7,500",
    monthly: "$997",
    mo: "/mo",
    featured: false,
    desc: "For teams moving fast. Founding pricing locks in while we build case studies with early partners.",
    features: [
      "Sub-60 second AI text + voice response",
      "1 CRM integration",
      "Custom qualification scripts",
      "All connected lead sources",
      "14-day go-live guarantee",
      "30-day weekly reports",
      "Email support",
    ],
  },
  {
    name: "Lead Lock",
    tag: "Most teams start here",
    setup: "$12,000",
    monthly: "$1,497",
    mo: "/mo",
    featured: true,
    desc: "The full system. Response, qualification, CRM write-back, and ongoing performance tracking.",
    features: [
      "Everything in Founding 5",
      "Up to 3 CRM integrations",
      "Buyer + seller script variants",
      "Advanced qualification routing",
      "Priority support",
      "Monthly performance review",
      "14-day go-live guarantee",
    ],
  },
  {
    name: "Lead Lock+",
    tag: "High-volume teams",
    setup: "$18,000",
    monthly: "$1,997",
    mo: "/mo",
    featured: false,
    desc: "For teams running 16+ agents or multiple lead sources that need custom routing and reporting.",
    features: [
      "Everything in Lead Lock",
      "Unlimited CRM connections",
      "Custom lead routing logic",
      "Dedicated account manager",
      "Quarterly strategy session",
      "Custom reporting dashboard",
    ],
  },
];

export default function PricingTable() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map(tier => (
          <div key={tier.name}
            className={`relative rounded-2xl border p-7 flex flex-col transition-colors ${
              tier.featured
                ? "bg-navy border-navy"
                : "bg-white border-[#E8E8E8] hover:border-[#ccc]"
            }`}>

            {tier.featured && (
              <div className="absolute -top-3 left-6">
                <span className="bg-accent text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                  {tier.tag}
                </span>
              </div>
            )}
            {!tier.featured && (
              <p className={`eyebrow mb-4 ${tier.featured ? "text-white/40" : "text-muted"}`}>
                {tier.tag}
              </p>
            )}

            <div className={`mb-1 ${tier.featured ? "mt-4" : ""}`}>
              <h3 className={`font-semibold text-[18px] mb-1 ${tier.featured ? "text-white" : "text-[#111]"}`}>
                {tier.name}
              </h3>
              <p className={`text-[13px] leading-relaxed mb-5 ${tier.featured ? "text-white/60" : "text-muted"}`}>
                {tier.desc}
              </p>
            </div>

            <div className="mb-6 pb-6 border-b border-opacity-20"
              style={{ borderColor: tier.featured ? "rgba(255,255,255,0.15)" : "#E8E8E8" }}>
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className={`font-serif text-[42px] font-light leading-none ${tier.featured ? "text-white" : "text-[#111]"}`}>
                  {tier.monthly}
                </span>
                <span className={`text-sm ${tier.featured ? "text-white/50" : "text-muted"}`}>/mo</span>
              </div>
              <p className={`text-[13px] ${tier.featured ? "text-white/50" : "text-muted"}`}>
                {tier.setup} setup
              </p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-7">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
                    <circle cx="7" cy="7" r="6.5" stroke={tier.featured ? "rgba(255,255,255,0.3)" : "#D0CCD8"} />
                    <path d="M4.5 7l1.75 1.75L9.5 5.5" stroke={tier.featured ? "white" : "#111"}
                      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className={`text-[13px] leading-snug ${tier.featured ? "text-white/75" : "text-[#555]"}`}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/audit"
              className={`w-full text-center font-semibold text-[13px] py-3 rounded-lg transition-colors duration-200 ${
                tier.featured
                  ? "bg-white text-navy hover:bg-white/90"
                  : "bg-navy text-white hover:bg-navy-h"
              }`}>
              Book an audit call
            </Link>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div className="border border-[#E8E8E8] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-shrink-0 w-9 h-9 border border-[#E8E8E8] rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#888" strokeWidth="1.4" strokeLinecap="round">
            <path d="M7 1L1.5 4v3.5c0 3.2 2.4 6 5.5 6.5 3.1-.5 5.5-3.3 5.5-6.5V4L7 1z" />
          </svg>
        </div>
        <div>
          <p className="text-[#111] font-semibold text-[14px] mb-1">14-day response guarantee</p>
          <p className="text-muted text-[13px] leading-relaxed">
            If connected internet leads are not answered in under 60 seconds within 14 days of access,
            setup is not due. No exceptions, no fine print.
          </p>
        </div>
      </div>
    </div>
  );
}
