import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-christmas-dark/70 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none md:pl-72">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className={clsx(
                "w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-visible pointer-events-auto relative",
                "border-8 border-christmas-green ring-4 ring-christmas-gold/50", // Enhanced Wreath border
                "mt-12", // Add margin top to account for Santa popping out
                className,
              )}
            >
              {/* Central Santa Animation */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 12,
                    delay: 0.1,
                  }}
                >
                  <motion.img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Santa%20Claus.png"
                    alt="Papai Noel"
                    className="w-32 h-32 drop-shadow-2xl filter contrast-110"
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>

              {/* Richer Wreath Decorations */}
              {/* Top Left Cluster */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-christmas-red rounded-full shadow-lg border-2 border-white z-20 flex items-center justify-center">
                <div className="w-4 h-4 bg-christmas-gold rounded-full opacity-60 blur-[1px]" />
              </div>
              <div className="absolute -top-2 left-6 w-7 h-7 bg-christmas-gold rounded-full shadow-md border border-white z-20" />
              <div className="absolute top-6 -left-3 w-5 h-5 bg-christmas-green-light rounded-full shadow-md border border-white z-20" />

              {/* Top Right Cluster */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-christmas-red rounded-full shadow-lg border-2 border-white z-20 flex items-center justify-center">
                <div className="w-4 h-4 bg-christmas-gold rounded-full opacity-60 blur-[1px]" />
              </div>
              <div className="absolute -top-2 right-6 w-7 h-7 bg-christmas-gold rounded-full shadow-md border border-white z-20" />
              <div className="absolute top-6 -right-3 w-5 h-5 bg-christmas-green-light rounded-full shadow-md border border-white z-20" />

              {/* Bottom Decorations */}
              <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-christmas-gold rounded-full shadow-lg border-2 border-white z-20" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-christmas-gold rounded-full shadow-lg border-2 border-white z-20" />

              {/* Subtle Background Texture & Gradient */}
              <div className="absolute inset-0 bg-linear-to-b from-christmas-red/5 to-transparent rounded-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-10 pointer-events-none rounded-2xl" />

              {/* Header */}
              <div className="relative p-6 pb-2 pt-16 text-center">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-christmas-red"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <h2 className="text-2xl font-display font-bold text-christmas-wine inline-flex items-center gap-2">
                  {title}
                </h2>
                <div className="w-16 h-1 bg-christmas-gold/30 mx-auto mt-3 rounded-full" />
              </div>

              {/* Content */}
              <div className="p-6 pt-2 relative z-10">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
