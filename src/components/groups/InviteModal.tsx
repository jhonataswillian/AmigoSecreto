import React from 'react';
import { Copy, Mail, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  onInvite: (value: string, type: 'email' | 'handle') => Promise<void>;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  groupName,
  onInvite,
}) => {
  const [inviteType, setInviteType] = React.useState<'email' | 'handle'>('email');
  const [value, setValue] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://amigosecreto.app/invite/${Math.random().toString(36).substr(2)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setIsLoading(true);
    try {
      await onInvite(value, inviteType);
      setValue('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Convidar para ${groupName}`}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compartilhar Link
          </label>
          <div className="flex space-x-2">
            <div className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500 truncate">
              https://amigosecreto.app/invite/...
            </div>
            <Button variant="outline" onClick={handleCopyLink}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Ou convide diretamente
            </span>
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              inviteType === 'email' ? 'bg-white shadow text-christmas-wine' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setInviteType('email')}
          >
            Por E-mail
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              inviteType === 'handle' ? 'bg-white shadow text-christmas-wine' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setInviteType('handle')}
          >
            Por @Usuário
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder={inviteType === 'email' ? "E-mail do amigo" : "@usuario"}
            type={inviteType === 'email' ? "email" : "text"}
            icon={inviteType === 'email' ? <Mail className="w-5 h-5" /> : <span className="font-bold text-lg text-gray-400">@</span>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!value}
            isLoading={isLoading}
          >
            Enviar Convite
          </Button>
        </form>
      </div>
    </Modal>
  );
};
