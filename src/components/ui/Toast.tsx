import React, { useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { clsx } from "clsx";
import type { Toast } from "../../types";
import { ToastContext } from "../../hooks/useToast";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 5000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-right-full",
              toast.type === "success" &&
                "bg-white border-green-100 text-green-800",
              toast.type === "error" && "bg-white border-red-100 text-red-800",
              toast.type === "warning" &&
                "bg-white border-yellow-100 text-yellow-800",
              toast.type === "info" && "bg-white border-blue-100 text-blue-800",
            )}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              {toast.type === "warning" && (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{toast.title}</h3>
              {toast.message && (
                <p className="text-sm opacity-90 mt-1">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 opacity-50" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
