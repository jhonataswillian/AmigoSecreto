import React from "react";

export const WreathFrame: React.FC = () => {
  return (
    <div className="absolute -inset-1 pointer-events-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-spin-slow"
        style={{ animationDuration: "20s" }}
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
          />
        </defs>
        {/* Leaves */}
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <path
              d="M50 5 Q 55 15 50 25 Q 45 15 50 5"
              fill="#166534"
              stroke="#14532d"
              strokeWidth="1"
            />
            <circle cx="50" cy="10" r="3" fill="#dc2626" />
          </g>
        ))}
      </svg>
      {/* Static Border */}
      <div className="absolute inset-1 rounded-full border-4 border-green-700/50" />
    </div>
  );
};
