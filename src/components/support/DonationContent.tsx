import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const DonationContent: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const pixKey = "1784e7f2-9b98-4c4e-bc5f-5bbc2d6d3cd8";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Zoom Modal */}
      {/* Zoom Modal */}
      {createPortal(
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="fixed inset-0 md:left-72 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full aspect-square overflow-hidden rounded-xl bg-white flex items-center justify-center border-4 border-gray-100 p-4">
                  <img
                    src="/assets/qrcode-pix.png"
                    alt="QR Code Pix Zoom"
                    className="w-full h-full object-contain image-pixelated"
                  />
                </div>
                <p className="text-center text-lg text-gray-600 mt-6 font-bold">
                  Escaneie o QR Code para contribuir
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl rounded-3xl overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600 leading-relaxed">
              O <strong>Amigo Secreto</strong> é um projeto desenvolvido com
              muito carinho e disponibilizado gratuitamente para unir famílias e
              amigos.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Se você gostou da experiência e quiser contribuir com qualquer
              valor para ajudar nos custos de servidor e manutenção, ficarei
              muito grato! ❤️
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center space-y-4">
            <button
              type="button"
              onClick={() => {
                console.log("QR Code clicked");
                setIsZoomed(true);
              }}
              className="w-48 h-48 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center p-2 overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow group relative z-10"
              title="Clique para ampliar"
            >
              <img
                src="/assets/qrcode-pix.png"
                alt="QR Code Pix"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 image-pixelated"
              />
            </button>

            <div className="w-full">
              <p className="text-xs text-gray-500 font-medium mb-2 text-center uppercase tracking-wider">
                Chave Pix (Copia e Cola)
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 truncate font-mono">
                  {pixKey}
                </div>
                <Button
                  size="sm"
                  onClick={handleCopyPix}
                  className={
                    copied
                      ? "bg-green-500 hover:bg-green-600 text-white px-3"
                      : "bg-christmas-wine hover:bg-christmas-wine-light text-white px-3"
                  }
                  title="Copiar Chave Pix"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center space-y-1 bg-white/50 p-3 rounded-lg border border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  Banco Inter
                </p>
                <p className="text-sm text-gray-600">
                  Jhonatas Willian Nicolete
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 italic">
              Sua doação é totalmente opcional.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
