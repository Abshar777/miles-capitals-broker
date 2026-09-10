import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent-foreground/10 backdrop-blur-4xl animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
