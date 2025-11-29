import React from "react";

export const WreathFrame: React.FC = () => {
  return (
    <div className="absolute -inset-[3px] rounded-full pointer-events-none z-20">
      {/* Animated Gradient Ring (SVG for transparency) */}
      <svg
        className="absolute inset-0 w-full h-full animate-spin"
        style={{ animationDuration: "3s" }}
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="33%" stopColor="#facc15" />
            <stop offset="66%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#magicGradient)"
          strokeWidth="3"
        />
      </svg>

      {/* Inner Border for definition */}
      <div className="absolute inset-[3px] rounded-full border border-white/30" />

      {/* Decorative Sparkles */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_8px_#fbbf24] animate-pulse" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_8px_#fbbf24] animate-pulse delay-700" />
      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full shadow-[0_0_8px_#f87171] animate-pulse delay-300" />
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80] animate-pulse delay-500" />
    </div>
  );
};
