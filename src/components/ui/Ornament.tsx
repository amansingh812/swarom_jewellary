/**
 * Swarom ornament primitives.
 *
 * The brand's Indian register is carried by structure, not colour: a pointed
 * temple arch that frames portraits, a hairline jaali lattice behind sections,
 * and a small kolam dot rule used as a divider. All three are drawn here as
 * original geometry so they scale cleanly and take their colour from tokens.
 *
 * `OrnamentDefs` must be rendered once per document (it lives in the site
 * layout) — `ArchFrame` and `JaaliPanel` reference its ids.
 */

/** Rendered once, high in the tree. Defines the arch clip and the lattice. */
export function OrnamentDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      className="absolute"
    >
      <defs>
        <clipPath id="swr-arch" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.45 C0,0.18 0.44,0.12 0.5,0 C0.56,0.12 1,0.18 1,0.45 L1,1 Z" />
        </clipPath>
        <pattern
          id="swr-jaali"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="16" y="16" width="32" height="32" />
            <rect
              x="16"
              y="16"
              width="32"
              height="32"
              transform="rotate(45 32 32)"
            />
            <path d="M32 0 L32 9 M32 55 L32 64 M0 32 L9 32 M55 32 L64 32" />
          </g>
        </pattern>
      </defs>
    </svg>
  );
}

/**
 * Clips its children into the pointed arch and traces the edge with a
 * gold hairline. Give it an aspect ratio via `className`.
 */
export function ArchFrame({
  children,
  className = "",
  hairline = true,
}: {
  children: React.ReactNode;
  className?: string;
  hairline?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="h-full w-full overflow-hidden bg-cream-200 [clip-path:url(#swr-arch)]">
        {children}
      </div>
      {hairline && (
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute inset-0 h-full w-full text-gold-soft"
        >
          <path
            d="M0,1 L0,0.45 C0,0.18 0.44,0.12 0.5,0 C0.56,0.12 1,0.18 1,0.45 L1,1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  );
}

/**
 * A decorative panel of jaali lattice. Position it with `className`
 * (it is absolutely positioned and ignores pointer events).
 */
export function JaaliPanel({
  className = "",
  opacity = 0.14,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
      className={`pointer-events-none absolute text-gold-soft ${className}`}
    >
      <rect width="100%" height="100%" fill="url(#swr-jaali)" />
    </svg>
  );
}

/** A small kolam-style dot rule — dot, diamond, dot. Used as a divider. */
export function KolamRule({ className = "" }: { className?: string }) {
  return (
    <svg
      width="46"
      height="8"
      viewBox="0 0 46 8"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 text-gold-soft ${className}`}
    >
      <circle cx="3" cy="4" r="1.6" fill="currentColor" />
      <path d="M23 1 L26 4 L23 7 L20 4 Z" fill="currentColor" />
      <circle cx="43" cy="4" r="1.6" fill="currentColor" />
    </svg>
  );
}

/**
 * A section divider: hairline, kolam dot motif, hairline. Both rules fade to
 * transparent at the outer ends so the mark reads as drawn rather than ruled.
 */
export function KolamDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-4 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-soft/70 md:w-20" />
      <KolamRule />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-soft/70 md:w-20" />
    </div>
  );
}

/** A small ambi (paisley) outline — the mango motif, used as a quiet mark. */
export function Paisley({
  className = "",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 text-gold-soft ${className}`}
    >
      <path
        d="M14 3c5 3 7 9 4 14s-10 6-13 2 0-10 4-11c3-1 5 2 4 5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The standard section opener — eyebrow, kolam divider, serif title, lede.
 * Using one component keeps the rhythm identical down the page instead of
 * every section inventing its own spacing.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "dark",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const onCream = tone === "dark";
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {eyebrow && (
        <p className={`swr-eyebrow mb-4 ${onCream ? "" : "!text-gold-soft"}`}>
          {eyebrow}
        </p>
      )}
      <KolamDivider className="mb-5" />
      <h2
        className={`font-serif text-[28px] leading-[1.2] md:text-[38px] ${
          onCream ? "text-charcoal" : "text-cream"
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`swr-lede mt-4 max-w-[460px] ${
            onCream ? "" : "!text-cream/75"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
