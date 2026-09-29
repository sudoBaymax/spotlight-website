"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function TalksLikeISA() {
  const sectionRef = useRef<HTMLElement>(null);
  const talksRef = useRef<HTMLSpanElement>(null);
  const likeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !talksRef.current || !likeRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const sectionH = rect.height;

      // progress: 0 = section bottom just entered viewport, 1 = section top at viewport top
      const totalTravel = viewH + sectionH;
      const scrolled = viewH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalTravel));

      // starts close, pulls apart as you scroll past
      const eased = progress * progress * progress; // cubic ease-in, kicks in hard
      const maxOffset = 600; // px each word travels outward

      const talksX = -eased * maxOffset; // moves further left
      const likeX  =  eased * maxOffset; // moves further right

      talksRef.current.style.transform = `translateX(${talksX}px)`;
      likeRef.current.style.transform  = `translateX(${likeX}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white overflow-hidden py-14 md:py-20"
    >
      {/* Row 1: Talks [tile] Like — words animate, tile is static */}
      <div className="flex items-center justify-center gap-4 md:gap-8 px-6 md:px-12 lg:px-16 mb-0">
        <span
          ref={talksRef}
          className="font-serif font-light text-[#111] leading-none whitespace-nowrap will-change-transform"
          style={{ fontSize: "clamp(42px, 7vw, 110px)" }}
        >
          Talks
        </span>

        {/* Static tile */}
        <div className="flex-shrink-0 w-[120px] h-[120px] md:w-[190px] md:h-[190px] lg:w-[225px] lg:h-[225px] rounded-2xl overflow-hidden relative">
          <Image
            src="/person.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <span
          ref={likeRef}
          className="font-serif font-light text-[#111] leading-none whitespace-nowrap will-change-transform"
          style={{ fontSize: "clamp(42px, 7vw, 110px)" }}
        >
          Like
        </span>
      </div>

      {/* Row 2: static */}
      <div className="flex justify-center px-6 md:px-12 lg:px-16 mt-10 md:mt-16">
        <span
          className="font-serif font-light text-[#111] leading-none"
          style={{ fontSize: "clamp(42px, 7vw, 110px)" }}
        >
          Your #1 ISA.
        </span>
      </div>
    </section>
  );
}
