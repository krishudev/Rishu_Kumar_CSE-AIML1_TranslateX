
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      // Apply shimmer animation defined in globals.css
      className={cn("animate-shimmer rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
