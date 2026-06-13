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
  "inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-widest " +
  "transition-all duration-300 ease-out " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const sizes: Record<Size, string> = {
  sm: "text-[10px] px-5 py-2.5",
  md: "text-[11px] px-7 py-3.5",
  lg: "text-[12px] px-8 py-4",
};

const variants: Record<Variant, string> = {
  primary:
    "rounded-none bg-charcoal text-cream hover:bg-charcoal-800",
  secondary:
    "rounded-none bg-transparent text-charcoal border border-charcoal " +
    "hover:bg-charcoal hover:text-cream",
  ghost:
    "rounded-none bg-transparent text-charcoal border border-[var(--hairline-strong)] " +
    "hover:border-charcoal",
  link:
    "rounded-none bg-transparent text-gold px-0 py-1 normal-case " +
    "swr-underline-anim text-[12px] uppercase tracking-widest",
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
