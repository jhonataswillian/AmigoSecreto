import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X } from "lucide-react";
import type { Participant } from "../../types";

interface DrawAnimationProps {
  onComplete: () => void;
  match: Participant;
  initialStage?: "countdown" | "ready" | "revealed";
  onViewWishlist: (participantId: string) => void;
}

interface DecorationProps {
  delay: number;
  emoji: string;
  left: number;
  duration: number;
}

const FallingDecoration = ({
  delay,
  emoji,
  left,
  duration,
}: DecorationProps) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0, rotate: 0 }}
      animate={{
        y: ["0vh", "100vh"],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "linear",
        repeat: Infinity,
      }}
      className="absolute text-4xl pointer-events-none"
      style={{ left: `${left}%` }}
    >
      {emoji}
    </motion.div>
  );
};

export const DrawAnimation: React.FC<DrawAnimationProps> = ({
  onComplete,
  match,
  initialStage = "countdown",
  onViewWishlist,
}) => {
  const [count, setCount] = React.useState(5);
  const [stage, setStage] = React.useState<"countdown" | "ready" | "revealed">(
    initialStage,
  );
  const [decorations, setDecorations] = React.useState<
    Array<{
      id: number;
      emoji: string;
      left: number;
      delay: number;
      duration: number;
    }>
  >([]);

  React.useEffect(() => {
    const emojis = ["❄️", "🎄", "🎅", "🎁", "🔔", "⛄", "⭐", "🦌", "🍪"];
    const newDecorations = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4, // Random duration between 3-7s
    }));
    setDecorations(newDecorations);
  }, []);

  React.useEffect(() => {
    if (stage === "countdown") {
      if (count > 0) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStage("ready");
      }
    }
  }, [count, stage]);

  return (
    <div className="fixed inset-0 md:left-72 z-50 flex items-center justify-center backdrop-blur-md bg-white/10 text-white overflow-hidden p-4">
      {/* Falling Decorations Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {decorations.map((dec) => (
          <FallingDecoration
            key={dec.id}
            emoji={dec.emoji}
            left={dec.left}
            delay={dec.delay}
            duration={dec.duration}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {stage === "countdown" ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-9xl font-display font-bold text-christmas-gold drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]"
          >
            {count > 0 ? count : "🎉"}
          </motion.div>
        ) : stage === "ready" ? (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center p-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl text-gray-900 max-w-sm w-full mx-4 relative"
          >
            <button
              onClick={onComplete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-display font-bold text-christmas-wine mb-2">
              Seu Amigo Secreto é...
            </h2>
            <p className="text-gray-600 mb-8">
              Prepare o presente com carinho!
            </p>

            <Gift className="w-24 h-24 text-christmas-red mx-auto mb-8 animate-bounce" />

            <button
              onClick={() => setStage("revealed")}
              className="w-full py-4 bg-christmas-green hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all animate-pulse"
            >
              Revelar Agora
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl text-gray-900 max-w-sm w-full mx-4 relative"
          >
            <button
              onClick={onComplete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-32 h-32 rounded-full bg-christmas-green mx-auto mb-6 overflow-hidden border-4 border-christmas-gold shadow-lg">
              <img
                src={
                  match.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.name}`
                }
                alt={match.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {match.name}
            </h2>
            <p className="text-gray-500 mb-6 font-medium">
              {match.handle || match.email}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => onViewWishlist(match.id)}
                className="w-full mt-8 bg-christmas-wine hover:bg-wine-700 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-christmas-wine/20 hover:shadow-xl hover:scale-[1.02] border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5 text-christmas-gold" />
                Ver Lista de Presentes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
