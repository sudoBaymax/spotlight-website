export default function OrbitDots({ px = 120 }: { px?: number }) {
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
