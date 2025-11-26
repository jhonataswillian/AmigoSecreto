import React from "react";
import type { Frame } from "../../types";
import { SnowFrame } from "../frames/SnowFrame";
import { RainFrame } from "../frames/RainFrame";
import { WreathFrame } from "../frames/WreathFrame";

interface FrameRendererProps {
  frame: Frame;
}

export const FrameRenderer: React.FC<FrameRendererProps> = ({ frame }) => {
  if (frame.id === "snow-animated") return <SnowFrame />;
  if (frame.id === "rain-animated") return <RainFrame />;
  if (frame.id === "wreath-animated") return <WreathFrame />;
  if (frame.image) {
    return (
      <img
        src={frame.image}
        alt="Frame"
        className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] object-contain pointer-events-none z-10"
      />
    );
  }
  return null;
};
