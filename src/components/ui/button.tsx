import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap font-sans font-medium transition-system focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90 rounded-md",
        secondary: "border border-foreground/20 bg-transparent text-foreground hover:bg-accent rounded-md",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90 rounded-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-md",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:opacity-90 rounded-md",
      },
      size: {
        default: "h-[40px] px-3 py-1 text-small",
        sm: "h-[32px] px-2 py-0.5 text-caption rounded-md",
        lg: "h-[48px] px-4 py-1.5 text-body rounded-md",
        icon: "h-[40px] w-[40px] rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
