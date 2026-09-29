"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq",          label: "FAQ"           },
  { href: "/audit",        label: "Audit"         },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "pt-3 flex justify-center" : "bg-white"
    }`}>
      <div className={`w-full max-w-[860px] mx-auto transition-all duration-300 ${
        scrolled
          ? "bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.10)]"
          : ""
      }`}>

        {/* Main row */}
        <div className="flex items-center justify-between px-5 h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <img src="/spotlight_logo_notext_transparent.png" alt="Spotlight" width={52} height={52} className="object-contain" />
            <span className="font-semibold text-[#111] text-[15px] tracking-tight">Spotlight</span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="text-[13px] text-[#666] hover:text-[#111] font-medium transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/contact" className="text-[13px] text-[#666] hover:text-[#111] transition-colors mr-1">
              Contact
            </Link>
            <Link href="/contact" className="btn-outline px-3.5 py-2">
              Contact sales
            </Link>
            <Link href="/audit" className="btn-dark px-3.5 py-2">
              Book audit
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-1 text-[#666] hover:text-[#111] transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}>
            {open ? (
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M2 2l13 13M15 2L2 15" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M2 4.5h13M2 8.5h13M2 12.5h13" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="md:hidden border-t border-[#E8E8E8] py-3 px-5">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-[13px] text-[#666] hover:text-[#111] transition-colors font-medium">
                {l.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)}
              className="block py-2.5 text-[13px] text-[#666] hover:text-[#111] transition-colors font-medium">
              Contact
            </Link>
            <div className="pt-3">
              <Link href="/audit" onClick={() => setOpen(false)}
                className="btn-dark w-full justify-center py-2.5">
                Book audit
              </Link>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
