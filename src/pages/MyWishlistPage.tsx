import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Gift,
  Link as LinkIcon,
  DollarSign,
  ExternalLink,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import type { WishlistItem } from "../types";

const wishlistSchema = z.object({
  name: z.string().min(2, "Nome do item é obrigatório"),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "O valor é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Valor inválido"),
  link: z.string().url("URL inválida").optional().or(z.literal("")),
});

type WishlistForm = z.infer<typeof wishlistSchema>;

export const MyWishlistPage: React.FC = () => {
  const { wishlist, addToWishlist, removeFromWishlist, updateWishlistItem } =
    useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WishlistForm>({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      link: "",
    },
  });

  const handleOpenModal = (item?: WishlistItem) => {
    if (item) {
      setEditingItem(item);
      setValue("name", item.name);
      setValue("description", item.description || "");
      setValue("price", item.price?.toString() || "");
      setValue("link", item.link || "");
    } else {
      setEditingItem(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    reset();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const onSubmit = async (data: WishlistForm) => {
    console.log("Submitting form data:", data);
    try {
      setIsLoading(true);

      // Sanitize price (replace comma with dot)
      const sanitizedPrice = data.price ? data.price.replace(",", ".") : "";

      const itemData = {
        name: data.name,
        description: data.description || null,
        price: sanitizedPrice ? Number(sanitizedPrice) : null,
        link: data.link || null,
      };

      console.log("Processed item data:", itemData);

      // Safety timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 15000),
      );

      if (editingItem) {
        await Promise.race([
          updateWishlistItem(editingItem.id, itemData),
          timeoutPromise,
        ]);
      } else {
        await Promise.race([addToWishlist(itemData), timeoutPromise]);
      }

      console.log("Operation successful");
      handleCloseModal();
    } catch (error) {
      console.error("Error in onSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        setIsLoading(true);
        // Safety timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 10000),
        );

        await Promise.race([removeFromWishlist(itemToDelete), timeoutPromise]);

        setDeleteModalOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Failed to delete item:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-christmas-wine">
            Minha Lista de Desejos
          </h1>
          <p className="text-gray-600 mt-1">
            Ajude seu Amigo Secreto a escolher o presente perfeito para você!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-christmas-wine bg-christmas-wine/10 px-4 py-2 rounded-xl">
            Presentes: {wishlist.length}/3
          </span>
          <Button
            onClick={() => handleOpenModal()}
            size="lg"
            className="bg-christmas-wine hover:bg-christmas-wine-light text-white shadow-lg shadow-christmas-wine/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={wishlist.length >= 3}
            title={
              wishlist.length >= 3
                ? "Você atingiu o limite de 3 presentes"
                : "Adicionar novo presente"
            }
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Content */}
      {wishlist.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-christmas-wine/10 bg-white/30">
          <div className="w-20 h-20 bg-christmas-wine/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-christmas-wine/40" />
          </div>
          <h3 className="text-xl font-bold text-christmas-wine mb-2">
            Sua lista está vazia
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Adicione itens que você gostaria de ganhar. Isso ajuda muito quem
            tirou você!
          </p>
          <Button
            onClick={() => handleOpenModal()}
            variant="outline"
            disabled={wishlist.length >= 3}
          >
            Adicionar Primeiro Item
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/40 bg-white/60 backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-christmas-wine/5 rounded-xl text-christmas-wine group-hover:bg-christmas-wine group-hover:text-white transition-colors duration-300">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-christmas-wine bg-christmas-wine/5 rounded-full hover:bg-christmas-wine/20 transition-colors"
                      title="Editar item"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-gray-900 mb-2 line-clamp-1">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {item.description}
                  </p>
                )}

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  {item.price ? (
                    <div className="flex items-center text-christmas-green font-bold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {item.price.toFixed(2)}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      Preço não informado
                    </span>
                  )}

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm font-medium text-christmas-wine hover:text-christmas-wine-light hover:underline"
                    >
                      Ver Loja
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Editar Desejo" : "Novo Desejo"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="O que você quer ganhar?"
              placeholder="Ex: Livro, Perfume, Jogo..."
              icon={<Gift className="w-5 h-5" />}
              error={errors.name?.message}
              {...register("name")}
              autoFocus
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-christmas-wine ml-1">
                Detalhes (Opcional)
              </label>
              <textarea
                className="w-full rounded-xl border-2 border-transparent bg-white/50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-christmas-wine/20 focus:bg-white focus:shadow-lg focus:shadow-christmas-wine/5 outline-none transition-all duration-300 min-h-[100px] resize-none"
                placeholder="Tamanho, cor, autor, voltagem..."
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Valor Estimado (R$)"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00"
                icon={<DollarSign className="w-5 h-5" />}
                error={errors.price?.message}
                {...register("price")}
              />

              <Input
                label="Link do Produto"
                type="url"
                placeholder="https://..."
                icon={<LinkIcon className="w-5 h-5" />}
                error={errors.link?.message}
                {...register("link")}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="w-1/3"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-2/3" isLoading={isLoading}>
              {editingItem ? "Salvar Alterações" : "Salvar Desejo"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir Desejo"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 text-red-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Tem certeza?</p>
              <p>Você quer remover este item da sua lista de desejos?</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              isLoading={isLoading}
            >
              Confirmar Exclusão
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
