import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Reference icon: draws a symbol from the Miles Capital UI sprite (`/public/miles/icons.svg`,
 * copied from the reference portal). Pass the short name, e.g. "dashboard-16", "sun-16",
 * "chevron-right-16". Fills with `currentColor` so text color utilities recolor it.
 */
export type IconProps = React.SVGProps<SVGSVGElement> & {
  name: string;
  size?: number;
};

export function Icon({ name, size = 16, className, ...props }: IconProps) {
  const id = name.includes("--") ? name : `icon-reg--ui-icon--${name}`;
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 inline-block", className)}
      {...props}
    >
      <use href={`/miles/icons.svg#${id}`} />
    </svg>
  );
}

export default Icon;
