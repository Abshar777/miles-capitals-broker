import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useWebHaptics } from "web-haptics/react";
import { defaultPatterns } from "web-haptics";

/**
 * Reference buttons: 4px radius. default = gold with black text (hover lighter gold),
 * secondary/outline = field-navy with white text, ghost/link = text only.
 * default size 40px (8px 24px), lg 56px (14px 24px), sm 32px.
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-[4px] text-[13.33px] font-normal outline outline-1 -outline-offset-1 outline-transparent transition-[outline-color,filter,background-color] duration-150 ease-in-out disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-primary/60 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-black hover:not-disabled:brightness-110 hover:not-disabled:outline-primary disabled:text-black/30",
        destructive: "bg-destructive text-white hover:not-disabled:brightness-110 hover:not-disabled:outline-destructive disabled:opacity-50",
        outline: "bg-field text-foreground hover:not-disabled:outline-primary/40 disabled:opacity-50",
        secondary: "bg-field text-foreground hover:not-disabled:outline-primary/40 disabled:opacity-50",
        ghost: "bg-transparent text-muted-foreground hover:text-foreground disabled:opacity-50",
        link: "bg-transparent text-primary hover:text-primary-hover px-0 disabled:opacity-50",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 px-4 py-1 gap-1.5 has-[>svg]:px-3",
        lg: "h-14 px-6 py-[14px] has-[>svg]:px-5",
        icon: "size-8",
        "icon-sm": "size-6",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button";
  const { trigger } = useWebHaptics();

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e);
        }
        trigger(defaultPatterns.success);
      }}
    />
  )
}

export { Button, buttonVariants }
