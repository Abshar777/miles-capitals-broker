import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** Reference ds-tag: 10px text, 4px radius, field-navy chip; status variants use 20% tints. */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[4px] border border-transparent px-1.5 h-4 text-[10px] leading-4 font-normal w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden capitalize",
  {
    variants: {
      variant: {
        default: "bg-field text-muted-foreground",
        secondary: "bg-field text-foreground",
        destructive: "bg-destructive/20 text-destructive",
        outline: "border-border bg-transparent text-muted-foreground",
        warning: "bg-warning/20 text-warning",
        success: "bg-positive/20 text-positive",
        gold: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
