import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-christmas-wine to-christmas-wine-light text-white shadow-lg shadow-christmas-wine/20 hover:shadow-xl hover:scale-[1.02] border border-white/10",
      secondary:
        "bg-gradient-to-r from-christmas-green to-christmas-green-light text-white shadow-lg shadow-christmas-green/20 hover:shadow-xl hover:scale-[1.02] border border-white/10",
      outline:
        "border-2 border-christmas-wine text-christmas-wine hover:bg-christmas-wine/5 hover:border-christmas-wine-light",
      ghost: "text-christmas-dark hover:bg-christmas-wine/5",
    };

    const sizes = {
      sm: "h-8 px-4 text-xs uppercase tracking-wider",
      md: "h-11 px-6 text-sm tracking-wide",
      lg: "h-14 px-8 text-base tracking-wide",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : null}
        <span
          className={cn("flex items-center gap-2", isLoading && "invisible")}
        >
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";
