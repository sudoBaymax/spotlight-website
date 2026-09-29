"use client";

import { useEffect, useRef } from "react";

export default function BuiltToConvert() {
  const sectionRef = useRef<HTMLElement>(null);
  const builtRef = useRef<HTMLSpanElement>(null);
  const convertRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !builtRef.current || !convertRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const sectionH = rect.height;

      const totalTravel = viewH + sectionH;
      const scrolled = viewH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalTravel));

      const eased = progress * progress * progress;
      const maxOffset = 600;

      builtRef.current.style.transform   = `translateX(${-eased * maxOffset}px)`;
      convertRef.current.style.transform = `translateX(${eased * maxOffset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-white overflow-hidden">
      <div className="flex items-center justify-center gap-6 md:gap-10 px-6 py-16 md:py-24">
        <span
          ref={builtRef}
          className="font-serif font-light text-[#111] leading-none whitespace-nowrap will-change-transform"
          style={{ fontSize: "clamp(48px, 8.5vw, 130px)" }}
        >
          Built
        </span>
        <img
          src="/spotlight_logo_notext_transparent.png"
          alt=""
          className="flex-shrink-0 w-[140px] h-[140px] md:w-[180px] md:h-[180px] object-contain"
        />
        <span
          ref={convertRef}
          className="font-serif font-light text-[#111] leading-none whitespace-nowrap will-change-transform"
          style={{ fontSize: "clamp(48px, 8.5vw, 130px)" }}
        >
          to convert.
        </span>
      </div>
    </section>
  );
}
