"use client";
import Link from "next/link";

export default function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-[#E8E8E8] px-4 py-3">
      <Link href="/audit"
        className="btn-dark w-full justify-center py-3 text-[14px]">
        Book a free audit
      </Link>
    </div>
  );
}
