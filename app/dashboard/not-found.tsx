import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="p-6 max-w-[480px]">
      <div className="bg-[#141414] border border-[#242424] rounded-xl p-6">
        <p className="text-[#FF2D1A] font-mono text-[11px] uppercase tracking-widest mb-2">404</p>
        <h1 className="text-white font-semibold text-[17px] mb-2">Page not found</h1>
        <p className="text-[#555] text-[13px] mb-5">
          This page doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex px-4 py-2 bg-[#FF2D1A] hover:bg-[#e02718] text-white font-semibold text-[13px] rounded-lg transition-colors"
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}
