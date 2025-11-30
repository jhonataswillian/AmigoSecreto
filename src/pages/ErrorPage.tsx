import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code: propCode,
  title: propTitle,
  message: propMessage,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { code?: number; title?: string; message?: string } | null;

  // Determine error details from props, state, or default to 404
  const code = propCode || state?.code || 404;
  
  let title = propTitle || state?.title;
  let message = propMessage || state?.message;

  // Default messages for common codes if not provided
  if (!title) {
    switch (code) {
      case 400:
        title = "Requisição Inválida";
        message = message || "O servidor não conseguiu processar sua solicitação.";
        break;
      case 401:
        title = "Não Autorizado";
        message = message || "Você precisa fazer login para acessar esta página.";
        break;
      case 403:
        title = "Acesso Negado";
        message = message || "Você não tem permissão para acessar este recurso.";
        break;
      case 404:
        title = "Página Não Encontrada";
        message = message || "O link que você acessou pode estar quebrado ou a página foi removida.";
        break;
      case 500:
        title = "Erro Interno";
        message = message || "Algo deu errado em nossos servidores. Tente novamente mais tarde.";
        break;
      default:
        title = "Ops! Algo deu errado";
        message = message || "Ocorreu um erro inesperado.";
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-christmas-red to-christmas-wine flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden border-4 border-christmas-gold/30">
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-christmas-green via-christmas-red to-christmas-gold" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-christmas-green/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-christmas-red/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <AlertTriangle className="w-12 h-12 text-christmas-red" />
          </div>

          <h1 className="text-6xl font-display font-bold text-christmas-wine mb-2">
            {code}
          </h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <Button
              onClick={() => navigate("/")}
              className="bg-christmas-wine hover:bg-christmas-wine-light text-white shadow-lg shadow-christmas-wine/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para o Início
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
