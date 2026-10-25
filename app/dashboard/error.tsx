"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isWarmup = error.message?.includes("warming up");

  return (
    <div className="p-6 max-w-[560px]">
      <div className="bg-[#1c1c1c] border border-[#FF2D1A]/20 rounded-xl p-6">
        <p className="text-[#FF2D1A] font-semibold text-[17px] mb-1">
          {isWarmup ? "n8n is warming up" : "Something went wrong"}
        </p>
        <p className="text-[#999] text-[15px] mb-5">
          {isWarmup
            ? "The data reader takes a moment to wake up after inactivity. Try again in a few seconds."
            : error.message ?? "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#FF2D1A] hover:bg-[#e02718] text-white font-semibold text-[15px] rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
