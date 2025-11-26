import React from "react";

export const SnowFrame: React.FC = () => {
  const [snowflakes, setSnowflakes] = React.useState<
    Array<{
      width: string;
      height: string;
      left: string;
      opacity: number;
      animationDuration: string;
      animationDelay: string;
    }>
  >([]);

  React.useEffect(() => {
    setSnowflakes(
      [...Array(20)].map(() => ({
        width: Math.random() * 4 + 2 + "px",
        height: Math.random() * 4 + 2 + "px",
        left: Math.random() * 100 + "%",
        opacity: Math.random(),
        animationDuration: Math.random() * 3 + 2 + "s",
        animationDelay: Math.random() * 5 + "s",
      })),
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full border-4 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
      {snowflakes.map((flake, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-snow"
          style={{
            width: flake.width,
            height: flake.height,
            left: flake.left,
            top: -10 + "px",
            opacity: flake.opacity,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
      <style>{`
        @keyframes snow {
          0% {
            transform: translateY(0) translateX(0);
          }
          100% {
            transform: translateY(150px) translateX(20px);
          }
        }
        .animate-snow {
          animation-name: snow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
