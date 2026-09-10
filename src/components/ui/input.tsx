import * as React from "react"

import { cn } from "@/lib/utils"

/** Reference field: 56px tall, field-navy fill, 4px radius, 15px text, gold border on focus. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      onWheel={(e) => e.currentTarget.blur()}
      data-slot="input"
      className={cn(
        "flex h-14 w-full min-w-0 rounded-[4px] border border-field bg-field px-[15px] py-3 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground shadow-none outline-none transition-colors",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:border-primary/60 focus-visible:ring-0",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
