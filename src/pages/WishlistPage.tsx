import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Gift,
  Plus,
  Trash2,
  DollarSign,
  Link as LinkIcon,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import type { WishlistItem } from "../types";

export const WishlistPage: React.FC = () => {
  const { groupId, participantId } = useParams<{
    groupId: string;
    participantId: string;
  }>();
  const navigate = useNavigate();
  const { groups, getGroup, updateParticipant } = useGroupStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({});

  useEffect(() => {
    if (groupId) {
      getGroup(groupId);
    }
  }, [groupId, getGroup]);

  const group = groups.find((g) => g.id === groupId);
  const participant = group?.participants.find((p) => p.id === participantId);

  if (!group || !participant) {
    return null; // Or a loading/error state
  }

  const isMe =
    user &&
    (participant.userId === user.id || participant.email === user.email);
  const isMySecretSanta = group.participants.find(
    (p) =>
      p.assignedToId === participantId &&
      (p.userId === user?.id || p.email === user?.email),
  );
  const canManage = isMe;

  // Allow viewing if it's me or if I drew this person
  if (!isMe && !isMySecretSanta) {
    return (
      <div className="p-8 text-center">
        <p>Você não tem permissão para ver esta lista.</p>
        <Button onClick={() => navigate(`/groups/${groupId}`)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleAddItem = async () => {
    if (!newItem.name) return;

    const item: WishlistItem = {
      id: window.crypto.randomUUID(),
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      link: newItem.link,
    };

    const updatedWishlist = [...(participant.wishlist || []), item];
    await updateParticipant(groupId!, participantId!, {
      wishlist: updatedWishlist,
    });
    setNewItem({});
    setIsModalOpen(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    const updatedWishlist = participant.wishlist.filter(
      (item) => item.id !== itemId,
    );
    await updateParticipant(groupId!, participantId!, {
      wishlist: updatedWishlist,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-christmas-wine">
            Lista de Desejos
          </h1>
          <p className="text-sm text-gray-500">de {participant.name}</p>
        </div>
      </div>

      <div className="space-y-4">
        {participant.wishlist.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>A lista está vazia.</p>
            {isMe && (
              <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                Adicionar Primeiro Item
              </Button>
            )}
          </Card>
        ) : (
          participant.wishlist.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex items-start justify-between"
            >
              <div>
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-4 pt-2">
                  {item.price !== undefined && item.price !== null && (
                    <span className="inline-flex items-center text-sm font-medium text-christmas-green">
                      <DollarSign className="w-4 h-4 mr-1" />
                      R$ {item.price.toFixed(2)}
                    </span>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                    >
                      <LinkIcon className="w-4 h-4 mr-1" />
                      Ver Link
                    </a>
                  )}
                </div>
              </div>

              {canManage && (
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </Card>
          ))
        )}

        {canManage && participant.wishlist.length > 0 && (
          <Button className="w-full" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Novo Item"
      >
        <div className="mb-6 text-gray-600">
          Descreva o item de desejo que você quer adicionar a este grupo.
        </div>
        <div className="space-y-4">
          <Input
            label="Nome do Item"
            placeholder="Ex: Livro, Perfume..."
            value={newItem.name || ""}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            icon={<Gift className="w-5 h-5" />}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 ml-1">
              Descrição (Opcional)
            </label>
            <textarea
              className="w-full rounded-xl border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-christmas-red focus:ring-christmas-red transition-all duration-200 shadow-sm min-h-[80px]"
              placeholder="Detalhes..."
              value={newItem.description || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valor (R$)"
              type="number"
              placeholder="0.00"
              value={newItem.price || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, price: Number(e.target.value) })
              }
              icon={<DollarSign className="w-5 h-5" />}
            />

            <Input
              label="Link (Opcional)"
              placeholder="https://..."
              value={newItem.link || ""}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              icon={<LinkIcon className="w-5 h-5" />}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-full"
              onClick={handleAddItem}
              disabled={!newItem.name}
            >
              Salvar Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
