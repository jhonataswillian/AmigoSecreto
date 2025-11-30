import React from "react";
import { Copy, Check } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useGroupStore } from "../../store/useGroupStore";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
  onInvite: (value: string) => Promise<void>;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  groupName,
  groupId,
  onInvite,
}) => {
  const { createInvite } = useGroupStore();
  // const [inviteType] = React.useState<"email" | "handle">("handle");
  const [value, setValue] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inviteLink, setInviteLink] = React.useState("");

  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isOpen && groupId) {
      createInvite(groupId).then((code) => {
        setInviteLink(`${window.location.origin}/invite/${code}`);
      });
    }
  }, [isOpen, groupId, createInvite]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setIsLoading(true);
    setError("");
    try {
      await onInvite(value);
      setValue("");
      onClose();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao enviar convite.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Convidar para ${groupName}`}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compartilhar Link
          </label>
          <div className="flex space-x-2">
            <div className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500 truncate">
              {inviteLink || "Gerando link..."}
            </div>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              disabled={!inviteLink}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome de usuário"
            placeholder="@usuario"
            type="text"
            icon={<span className="font-bold text-lg text-gray-400">@</span>}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            error={error}
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
