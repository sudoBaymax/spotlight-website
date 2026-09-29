import Link from "next/link";

const cols = [
  {
    heading: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/audit",        label: "Book an audit" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/faq",     label: "FAQ"     },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer>
      {/* White multi-column footer */}
      <div className="bg-white">
        <div className="section-container py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-[240px_1fr_1fr_1fr] gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img src="/spotlight_logo_notext_transparent.png" alt="Spotlight" width={28} height={28} className="object-contain" />
                <span className="font-semibold text-[#111] text-[14px] tracking-tight">Spotlight</span>
              </Link>
              <p className="text-[#888] text-[13px] leading-relaxed max-w-[200px]">
                The 60-second lead lock for real estate teams.
              </p>
              <a href="mailto:hello@spotlight.rent"
                className="inline-block mt-4 text-[#888] hover:text-[#111] text-[13px] transition-colors">
                hello@spotlight.rent
              </a>
            </div>

            {/* Nav columns */}
            {cols.map(col => (
              <div key={col.heading}>
                <p className="text-[11px] font-semibold text-[#aaa] tracking-[0.14em] uppercase mb-4">
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.href}>
                      <Link href={l.href}
                        className="text-[13px] text-[#666] hover:text-[#111] transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* CTA column */}
            <div>
              <p className="text-[11px] font-semibold text-[#aaa] tracking-[0.14em] uppercase mb-4">
                Get started
              </p>
              <p className="text-[13px] text-[#888] leading-relaxed mb-4">
                See what your team&apos;s response time is costing you.
              </p>
              <Link href="/audit" className="btn-dark px-4 py-2.5 text-[13px]">
                Book a free audit
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[#bbb] text-[12px]">
              &copy; {new Date().getFullYear()} Spotlight Security Group Inc. All rights reserved.
            </p>
            <p className="text-[#ccc] text-[12px]">Built for real estate team leaders.</p>
          </div>
        </div>
      </div>

      {/* Dark wordmark end-cap */}
      <div
        className="relative overflow-hidden py-12 md:py-16"
        style={{
          background: `
            radial-gradient(ellipse 70% 90% at 40% 110%, rgba(26,58,156,0.25) 0%, transparent 55%),
            radial-gradient(ellipse 50% 70% at 75% 60%, rgba(6,60,50,0.18) 0%, transparent 55%),
            #050A12
          `,
        }}
      >
        <div className="section-container flex items-center gap-5">
          <img src="/spotlight_logo_notext_transparent.png" alt="" width={264} height={264} className="object-contain opacity-70 flex-shrink-0" />
          <span
            className="font-sans font-light text-white/[0.15] select-none leading-none tracking-tight"
            style={{ fontSize: "clamp(56px, 13vw, 180px)" }}
            aria-hidden
          >
            Spotlight
          </span>
        </div>
      </div>
    </footer>
  );
}
