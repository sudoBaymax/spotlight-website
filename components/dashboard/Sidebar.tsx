"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/calls",
    label: "Calls",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 2.5A1.5 1.5 0 013.5 1h1a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 014.5 5H4a8 8 0 008 8v-.5A1.5 1.5 0 0113.5 11h1A1.5 1.5 0 0116 12.5v1A1.5 1.5 0 0114.5 15C7.044 15 1 8.956 1 1.5 1 1.224 1.224 1 1.5 1H2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/leads",
    label: "Leads",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/bookings",
    label: "Bookings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="14" height="12" rx="2" />
        <path d="M1 7h14M5 1v4M11 1v4" />
      </svg>
    ),
  },
  {
    href: "/dashboard/followups",
    label: "Follow-ups",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H2a1 1 0 00-1 1v8a1 1 0 001 1h4l2 2 2-2h4a1 1 0 001-1V3a1 1 0 00-1-1z" />
        <path d="M5 6h6M5 9h4" />
      </svg>
    ),
  },
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4h12M2 8h8M2 12h6" />
        <circle cx="13" cy="11" r="2.5" />
        <path d="M12 11l.75.75 1.5-1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/alerts",
    label: "Alerts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 1L1 14h14L8 1z" />
        <path d="M8 6v3.5M8 11.5v.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/forms",
    label: "Forms",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="14" height="14" rx="2" />
        <path d="M4 5h8M4 8h5M4 11h3" />
      </svg>
    ),
  },
];

const ADMIN_NAV = [
  {
    href: "/dashboard/admin",
    label: "All tenants",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="5.5" r="2.5" />
        <circle cx="11" cy="5.5" r="2.5" />
        <path d="M1 14c0-2.21 1.79-4 4-4M10 14c0-2.21 1.79-4 4-4" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/tenants/new",
    label: "Create tenant",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="6" r="3" />
        <path d="M2 14c0-3.314 2.686-6 6-6M12 11v4M14 13h-4" />
      </svg>
    ),
  },
];

export default function Sidebar({
  pendingApprovals = 0,
  role,
  label,
  impersonating,
}: {
  pendingApprovals?: number;
  role: "superadmin" | "client";
  label?: string;
  impersonating?: { label: string };
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-[#0C0C0C] border-r border-[#1a1a1a] px-3 py-5 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="#FF2D1A" />
          <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 16h7" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span className="text-white font-semibold text-[15px] tracking-tight">Spotlight</span>
      </div>

      {/* Impersonation banner */}
      {impersonating && (
        <div className="mx-1 mb-4 bg-amber-400/5 border border-amber-400/15 rounded-lg px-3 py-2.5">
          <p className="text-amber-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Viewing as</p>
          <p className="text-amber-300 text-[12px] font-medium truncate mb-1.5">{impersonating.label}</p>
          <Link
            href="/api/admin/impersonate"
            className="text-amber-400/60 hover:text-amber-400 text-[11px] transition-colors"
          >
            ← Exit to admin
          </Link>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ href, label: navLabel, icon }) => {
          const active = isActive(href);
          const showBadge = href === "/dashboard/followups" && pendingApprovals > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                active
                  ? "bg-[#FF2D1A]/10 text-[#FF2D1A]"
                  : "text-[#666] hover:text-[#ccc] hover:bg-[#141414]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {icon}
                {navLabel}
              </span>
              {showBadge && (
                <span className="bg-[#FF2D1A] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {pendingApprovals}
                </span>
              )}
            </Link>
          );
        })}

        {/* Setup — clients only (superadmin manages keys via admin panel) */}
        {role === "client" && (
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              isActive("/dashboard/settings")
                ? "bg-[#FF2D1A]/10 text-[#FF2D1A]"
                : "text-[#666] hover:text-[#ccc] hover:bg-[#141414]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="2.5" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" />
            </svg>
            Setup
          </Link>
        )}

        {/* Admin section — superadmin only, hidden while impersonating */}
        {role === "superadmin" && !impersonating && (
          <div className="pt-4 mt-2 border-t border-[#1a1a1a]">
            <p className="text-[#2a2a2a] text-[10px] uppercase tracking-wider font-medium px-3 mb-1.5">
              Admin
            </p>
            {ADMIN_NAV.map(({ href, label: navLabel, icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-[#FF2D1A]/10 text-[#FF2D1A]"
                      : "text-[#666] hover:text-[#ccc] hover:bg-[#141414]"
                  }`}
                >
                  {icon}
                  {navLabel}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1a1a1a] pt-4 mt-4 space-y-1">
        <p className="text-[#3a3a3a] text-[11px] px-3 mb-2 uppercase tracking-wider font-medium truncate">
          {label ?? "Account"}
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#555] hover:text-[#ccc] hover:bg-[#141414] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5.5 1H2a1 1 0 00-1 1v11a1 1 0 001 1h3.5M10 10.5l3.5-3L10 4M13.5 7.5H5.5" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
