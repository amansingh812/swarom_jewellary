import { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  withRule?: boolean;
  className?: string;
}

/**
 * UPPERCASE letterspaced label — the visual signature of the brand.
 * With `withRule`, gets the 1px hairlines on either side (Mentis-style).
 */
export function Eyebrow({ children, withRule, className = "" }: EyebrowProps) {
  if (withRule) {
    return (
      <span className={`swr-hairline-rule swr-eyebrow ${className}`}>
        <em className="not-italic">{children}</em>
      </span>
    );
  }
  return <span className={`swr-eyebrow ${className}`}>{children}</span>;
}
