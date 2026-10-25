interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="bg-[#141414] border border-[#242424] rounded-xl p-5">
      <p className="text-[#555] text-[11px] font-semibold uppercase tracking-wider mb-3">{label}</p>
      <p className={`text-[32px] font-semibold leading-none mb-1 ${accent ? "text-[#FF2D1A]" : "text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-[#555] text-[12px] mt-2">{sub}</p>}
    </div>
  );
}
