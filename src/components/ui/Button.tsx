import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "link" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & { href: string };

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide " +
  "transition-all duration-150 ease-out active:scale-[0.98] " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const sizes: Record<Size, string> = {
  sm: "text-[11px] px-4 py-2",
  md: "text-[13px] px-5 py-3",
  lg: "text-[14px] px-7 py-3.5",
};

const variants: Record<Variant, string> = {
  primary:
    "rounded-pill bg-charcoal text-cream hover:bg-charcoal-800 " +
    "shadow-soft",
  secondary:
    "rounded-pill bg-transparent text-charcoal border border-[var(--hairline-strong)] " +
    "hover:bg-cream-50 hover:border-charcoal",
  ghost:
    "rounded-pill bg-cream-200 text-charcoal hover:bg-cream-50 border border-transparent",
  link:
    "rounded-none bg-transparent text-charcoal px-0 py-3 " +
    "border-b border-[var(--hairline)] hover:border-charcoal " +
    "text-[12px] uppercase tracking-wider",
};

function cls(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", block, className, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cls(
          base,
          sizes[size],
          variants[variant],
          block && "w-full",
          className
        )}
        {...rest}
      />
    );
  }
);

export function ButtonLink({
  variant = "primary",
  size = "md",
  block,
  className,
  href,
  ...rest
}: LinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const computed = cls(
    base,
    sizes[size],
    variants[variant],
    block && "w-full",
    className
  );
  if (isExternal) {
    return (
      <a
        href={href}
        className={computed}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...rest}
      />
    );
  }
  return <Link href={href} className={computed} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
}
