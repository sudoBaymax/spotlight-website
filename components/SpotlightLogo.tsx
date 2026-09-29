interface SpotlightLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function SpotlightLogo({
  className = "h-8 w-8",
  iconOnly = false,
}: SpotlightLogoProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={iconOnly}
      role={iconOnly ? "presentation" : "img"}
      aria-label={iconOnly ? undefined : "Spotlight logo mark"}
    >
      {/* Light housing — the source lens */}
      <circle cx="10" cy="10" r="7.5" fill="#FF2D1A" />
      {/* Inner highlight for depth */}
      <circle cx="8.5" cy="8.5" r="3" fill="#FF6B5E" opacity="0.5" />
      {/* Beam — trapezoid projecting to lower-right */}
      <path
        d="M15.5 14.5 L30.5 28 L27 31.5 L10.5 19.5 Z"
        fill="#FF2D1A"
        opacity="0.38"
      />
      {/* Beam tip ellipse — the illuminated circle on stage */}
      <ellipse
        cx="28.5"
        cy="29.5"
        rx="2.8"
        ry="1.6"
        fill="#FF2D1A"
        opacity="0.28"
        transform="rotate(-15 28.5 29.5)"
      />
    </svg>
  );
}
