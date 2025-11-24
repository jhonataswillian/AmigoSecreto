import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface DrawAnimationProps {
  onComplete: () => void;
}

export const DrawAnimation: React.FC<DrawAnimationProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-christmas-wine text-white">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [1, 1.2, 1], rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <Gift className="w-32 h-32" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-display font-bold mb-4"
      >
        Sorteando...
      </motion.h2>

      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [-10, 0, -10] }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
          />
        ))}
      </div>
    </div>
  );
};
