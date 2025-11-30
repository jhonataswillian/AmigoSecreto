import React from "react";
import { DonationContent } from "../components/support/DonationContent";
import { Heart } from "lucide-react";

export const DonatePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <Heart className="w-8 h-8 text-christmas-red fill-current animate-pulse-slow" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Apoie o Projeto
        </h1>
        <p className="text-gray-600 text-lg">
          Ajude a manter a magia do Natal no ar!
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <DonationContent />
      </div>
    </div>
  );
};
