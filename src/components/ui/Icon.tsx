import { SVGProps } from "react";

export type IconName =
  | "bag"
  | "search"
  | "user"
  | "arrow-right"
  | "arrow-up-right"
  | "plus"
  | "minus"
  | "menu"
  | "close"
  | "instagram"
  | "whatsapp"
  | "mail"
  | "shield"
  | "ring"
  | "stamp"
  | "truck"
  | "chevron-down"
  | "chevron-right"
  | "check"
  | "sparkle"
  | "heart"
  | "leaf";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number | string;
}

/**
 * Renders one of the hairline icons from /public/brand/icons.svg.
 * `currentColor` is used for strokes, so the icon takes the parent text color.
 */
export function Icon({ name, size = 16, className = "", ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      {...rest}
    >
      <use href={`/brand/icons.svg#swr-${name}`} />
    </svg>
  );
}
