"use client";

import { useEffect, useRef } from "react";

// CSS stagger: mt-0 / mt-20 / mt-40 / mt-60 → 0 / 80 / 160 / 240 px
// Card 1 stays fixed; cards 2-4 rise at halving speeds as you scroll
// CSS stagger px values (must match md:mt-0/40/64/80 = 0/160/256/320px)
const STAGGER_PX = [0, 160, 256, 320];
// Speed multipliers: card1 fixed, each half speed of previous
const SPEEDS     = [0, 0.65, 0.5, 0.25];
// Raw lift per unit of progress for card2; clamped per card so no card overshoots card1
const BASE_SPEED = 400;

const channels = [
  {
    name: "Voice Response",
    desc: "Places a live call to the lead within 60 seconds. Natural conversation, not a robocall.",
    stagger: "",
  },
  {
    name: "SMS Response",
    desc: "Sends a qualifying text message simultaneously. Meets leads on the channel they actually use.",
    stagger: "md:mt-40",
  },
  {
    name: "CRM Write-Back",
    desc: "Writes the full qualification note back to your CRM automatically. No manual entry.",
    stagger: "md:mt-64",
  },
  {
    name: "Reporting",
    desc: "Weekly performance numbers for your first 30 days. Response time, contact rate, appointments booked.",
    stagger: "md:mt-80",
  },
];


function ChannelIcon({ name }: { name: string }) {
  if (name === "Voice Response") return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" stroke="#0f1520" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 11.5c-.7-.7-1.5-.7-2.2 0l-1 1c-1.5-.8-2.8-2.1-3.6-3.6l1-1c.7-.7.7-1.5 0-2.2L7.2 4.2c-.7-.7-1.7-.7-2.3 0L3.8 5.3C3 6.1 3 7.4 3.8 8.2 5.7 10.9 7.1 12.3 9.8 14.2c.8.8 2.1.8 2.9 0l1.1-1.1c.7-.6.7-1.6-.3-1.6z" />
    </svg>
  );
  if (name === "SMS Response") return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" stroke="#0f1520" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3H3a1 1 0 00-1 1v8a1 1 0 001 1h5l3 3v-3h4a1 1 0 001-1V4a1 1 0 00-1-1z" />
    </svg>
  );
  if (name === "CRM Write-Back") return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" stroke="#0f1520" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="14" height="14" rx="2" />
      <path d="M6 9h6M6 12h4M6 6h6" />
    </svg>
  );
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" stroke="#0f1520" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14l4-5 3 3 4-7" />
      <circle cx="15" cy="5" r="1" fill="#0f1520" stroke="none" />
    </svg>
  );
}

export default function ChannelCascade() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const sectionH = rect.height;
      const totalTravel = viewH + sectionH;
      const scrolled = viewH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalTravel));

      // Animate in the middle of the scroll window so cards are visible during motion
      const t = Math.max(0, Math.min(1, (progress - 0.1) / 0.8));
      const eased = t * t * (3 - 2 * t); // smooth-step

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        // Clamp so no card ever rises above card1's position
        const lift = Math.min(eased * BASE_SPEED * SPEEDS[i], STAGGER_PX[i]);
        el.style.transform = `translateY(${-lift}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-white pt-16 md:pt-28 pb-16 md:pb-[400px] overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-14 md:mb-20">
          <p className="eyebrow text-muted mb-4">Integrations</p>
          <h2
            className="font-serif font-light text-[#111] leading-tight"
            style={{ fontSize: "clamp(34px, 5.5vw, 76px)" }}
          >
            Every channel.
            <br />
            One system.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 items-start">
          {channels.map((ch, i) => (
            <div
              key={ch.name}
              ref={el => { cardRefs.current[i] = el; }}
              className={`relative bg-[#EDEDF5] rounded-3xl p-6 md:p-7 flex flex-col will-change-transform ${ch.stagger}`}
              style={{ minHeight: 340 }}
            >
              {/* Title — top left, width capped so it doesn't bleed under the icon */}
              <h3 className="text-[#0f1520] font-semibold text-[17px] md:text-[19px] leading-snug max-w-[60%]">
                {ch.name}
              </h3>

              {/* Icon circle — absolute, pinned to top-right corner */}
              <div className="absolute top-4 right-4 w-[54px] h-[54px] bg-white rounded-full flex items-center justify-center">
                <ChannelIcon name={ch.name} />
              </div>

              {/* Description — bottom left */}
              <p className="text-[#6670B0] text-[13px] md:text-[14px] leading-relaxed mt-auto pt-10">
                {ch.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
