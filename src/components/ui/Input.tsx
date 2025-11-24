import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-christmas-wine/50 group-focus-within:text-christmas-wine transition-colors duration-300">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-white/50 border-2 border-transparent rounded-xl px-4 py-3.5 text-christmas-dark placeholder:text-gray-400 outline-none transition-all duration-300",
              "focus:bg-white focus:border-christmas-wine/20 focus:shadow-lg focus:shadow-christmas-wine/5",
              "hover:bg-white/80",
              icon && "pl-11",
              error && "border-red-300 bg-red-50/50",
              className,
            )}
            {...props}
          />
          {label && (
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold text-christmas-wine uppercase tracking-wider rounded-full shadow-sm">
              {label}
            </label>
          )}
        </div>
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-gray-500 ml-3">{helperText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 ml-3 animate-in slide-in-from-left-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
