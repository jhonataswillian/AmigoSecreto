import { X, Gift, Tag, DollarSign, Link as LinkIcon, HelpCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface WishlistHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistHelpModal({ isOpen, onClose }: WishlistHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:pl-72">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ring-1 ring-white/20 flex flex-col max-h-[90vh]">
        {/* Header with Christmas Theme */}
        <div className="bg-linear-to-r from-red-600 to-red-700 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Gift className="w-32 h-32 transform rotate-12" />
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Como funciona a Lista?</h2>
              <p className="text-red-100 text-sm">Ajude seu Amigo Secreto a acertar no presente!</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <p className="text-gray-600 text-sm leading-relaxed">
            Você pode adicionar até <strong className="text-red-600">3 sugestões</strong> de presentes. 
            Isso não é uma lista de compras obrigatória, mas sim um guia para inspirar quem tirou você! 🎁
          </p>

          <div className="space-y-4">
            {/* Field: Name */}
            <div className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm h-fit text-red-500">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  Nome do Produto
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Obrigatório</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  O que você quer ganhar? <br />
                  Exemplo: "Livro de Ficção", "Fones de Ouvido", "Camiseta Geek".
                </p>
              </div>
            </div>

            {/* Field: Description */}
            <div className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm h-fit text-blue-500">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  Descrição
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Opcional</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Detalhes importantes como tamanho, cor, voltagem ou autor preferido.
                </p>
              </div>
            </div>

            {/* Field: Value */}
            <div className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm h-fit text-green-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  Valor Aproximado
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Obrigatório</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ajuda a saber se cabe no orçamento do grupo. Não precisa ser exato!
                </p>
              </div>
            </div>

            {/* Field: Link */}
            <div className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm h-fit text-purple-500">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  Link de Compra
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Opcional</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Viu em algum site específico? Cole o link para facilitar a vida do seu amigo secreto!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Entendi, vamos lá!
          </Button>
        </div>
      </div>
    </div>
  );
}
