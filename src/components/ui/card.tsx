
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Adjusted default rounding to xl (12px)
      "rounded-xl border bg-card text-card-foreground shadow-md",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Adjust padding for mobile (p-4 default)
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Use h3 for semantic heading and apply Poppins font styling
const CardTitle = React.forwardRef<
  HTMLHeadingElement, // Changed to HTMLHeadingElement
  React.HTMLAttributes<HTMLHeadingElement> // Changed to HTMLHeadingElement
>(({ className, ...props }, ref) => (
  <h3 // Changed div to h3
    ref={ref}
    className={cn(
      // Use font-sans (Poppins) and bold, size from globals.css for headings (text-xl/2xl)
      "text-xl font-bold font-sans leading-none tracking-tight md:text-2xl",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Use p for semantic paragraph and apply Poppins font styling
const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Changed to HTMLParagraphElement
  React.HTMLAttributes<HTMLParagraphElement> // Changed to HTMLParagraphElement
>(({ className, ...props }, ref) => (
  <p // Changed div to p
    ref={ref}
    // Use font-sans (Poppins) and regular weight, size from globals.css for body (text-base/lg)
    className={cn("text-base font-sans text-muted-foreground md:text-lg", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Adjust padding (p-4), apply Poppins font styling to content
  <div ref={ref} className={cn("p-4 pt-0 font-sans text-lg", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Adjust padding (p-4)
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
