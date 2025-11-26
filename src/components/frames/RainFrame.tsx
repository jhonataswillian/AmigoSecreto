import React from "react";

export const RainFrame: React.FC = () => {
  const [raindrops, setRaindrops] = React.useState<
    Array<{
      height: string;
      left: string;
      opacity: number;
      animationDuration: string;
      animationDelay: string;
    }>
  >([]);

  React.useEffect(() => {
    setRaindrops(
      [...Array(20)].map(() => ({
        height: Math.random() * 10 + 5 + "px",
        left: Math.random() * 100 + "%",
        opacity: Math.random() * 0.5 + 0.3,
        animationDuration: Math.random() * 1 + 0.5 + "s",
        animationDelay: Math.random() * 2 + "s",
      })),
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full border-4 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
      {raindrops.map((drop, i) => (
        <div
          key={i}
          className="absolute bg-blue-400 rounded-full animate-rain"
          style={{
            width: "2px",
            height: drop.height,
            left: drop.left,
            top: -20 + "px",
            opacity: drop.opacity,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay,
          }}
        />
      ))}
      <style>{`
        @keyframes rain {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(150px);
          }
        }
        .animate-rain {
          animation-name: rain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
