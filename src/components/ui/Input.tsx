import React, { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";

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
  ({ label, error, helperText, icon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

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
            type={inputType}
            className={cn(
              "w-full bg-white/50 border-2 border-transparent rounded-xl px-4 py-3.5 text-christmas-dark placeholder:text-gray-400 outline-none transition-all duration-300",
              "focus:bg-white focus:border-christmas-wine/20 focus:shadow-lg focus:shadow-christmas-wine/5",
              "hover:bg-white/80",
              icon && "pl-11",
              isPassword && "pr-12", // Add padding for eye icon
              error && "border-red-300 bg-red-50/50",
              className,
            )}
            {...props}
          />
          {label && (
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold text-christmas-wine uppercase tracking-wider rounded-full shadow-sm z-10 whitespace-nowrap max-w-[90%] truncate pointer-events-none">
              {label}
            </label>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-christmas-wine transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
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
