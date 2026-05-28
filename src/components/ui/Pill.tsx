"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  ghost?: boolean;
  children: ReactNode;
}

export function Pill({ active, ghost, className = "", children, ...rest }: PillProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-[12px] " +
    "font-sans tracking-wide transition-colors duration-150 ease-out whitespace-nowrap";
  const styles = active
    ? "bg-charcoal text-cream border border-charcoal"
    : ghost
    ? "bg-cream-200 text-charcoal/80 border border-transparent hover:bg-cream-50"
    : "bg-transparent text-charcoal/80 border border-[var(--hairline)] hover:border-[var(--hairline-strong)] hover:text-charcoal";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}
