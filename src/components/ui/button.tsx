
'use client'; // Add 'use client' directive

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles: flex layout, font, rounding, transitions, focus ring
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
         // Default: Use accent (teal) color
        default: "bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-accent underline-offset-4 hover:underline active:scale-95", // Link uses accent
      },
      size: {
         // Default ensures 48dp touch target (h-12)
        default: "h-12 px-4 py-2",
        sm: "h-10 rounded-md px-3", // 40dp
        lg: "h-14 rounded-lg px-8", // 56dp
        icon: "h-12 w-12", // 48dp square
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  noBounce?: boolean; // Option to disable bounce animation
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, noBounce = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const buttonRef = React.useRef<HTMLButtonElement>(null); // Ref for the button element

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      // Ensure ripple container exists
       let rippleContainer = button.querySelector('.ripple-container');
       if (!rippleContainer) {
         rippleContainer = document.createElement('div');
         // Match button rounding (rounded-md is default)
         rippleContainer.className = 'ripple-container absolute inset-0 overflow-hidden rounded-md pointer-events-none';
         button.appendChild(rippleContainer);
         // Ensure button is positioned relative for absolute positioning of ripple
         if (getComputedStyle(button).position === 'static') {
             button.style.position = 'relative';
         }
       }


      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      const rect = button.getBoundingClientRect();
       // Calculate position relative to the button's bounds
       circle.style.left = `${event.clientX - rect.left - radius}px`;
       circle.style.top = `${event.clientY - rect.top - radius}px`;
      circle.classList.add("ripple");


      // Remove previous ripple if it exists within the container
      const oldRipple = rippleContainer.querySelector(".ripple");
      if (oldRipple) {
        oldRipple.remove();
      }

      rippleContainer.appendChild(circle);

      // Remove the circle after the animation completes
       circle.addEventListener('animationend', () => {
           circle.remove();
       });
    };

     // Bounce effect (simple scale)
     const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!noBounce) {
            event.currentTarget.classList.add('active:scale-95'); // Use Tailwind active scale
        }
         if (props.onMouseDown) {
             props.onMouseDown(event);
         }
     };

    const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Bounce effect handled by active:scale-95, no need to remove class here
        if (props.onMouseUp) {
            props.onMouseUp(event);
        }
    };


    // Combine refs if asChild is used
    const combinedRef = React.useCallback(
        (instance: HTMLButtonElement | null) => {
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = instance;
          if (typeof ref === 'function') {
            ref(instance);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current = instance;
          }
        },
        [ref]
    );


    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={combinedRef} // Use combined ref
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            createRipple(e); // Trigger ripple
            if (props.onClick) {
                props.onClick(e);
            }
        }}
         onMouseDown={handleMouseDown}
         onMouseUp={handleMouseUp}
         // Add touch equivalents
         onTouchStart={(e: React.TouchEvent<HTMLButtonElement>) => {
            if (!noBounce) {
                 e.currentTarget.classList.add('active:scale-95');
            }
            if (props.onTouchStart) props.onTouchStart(e);
         }}
         onTouchEnd={(e: React.TouchEvent<HTMLButtonElement>) => {
            // Active scale removed automatically
             if (props.onTouchEnd) props.onTouchEnd(e);
         }}
        {...props}
      >
        {children}
         {/* Ripple container added dynamically if needed */}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
