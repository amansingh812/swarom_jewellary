interface ShimmerLineProps {
  className?: string;
}

/** 1px gold-fading hairline that pulses softly. Used under the wordmark. */
export function ShimmerLine({ className = "" }: ShimmerLineProps) {
  return <div aria-hidden className={`swr-shimmer-line ${className}`} />;
}
