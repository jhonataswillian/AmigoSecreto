import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  UserPlus,
  Gift,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  LogOut, // Added LogOut import
  Crown, // Added Crown
} from "lucide-react";
import { useGroupStore } from "../store/useGroupStore";
import type { Participant, WishlistItem } from "../types";
import { useAuthStore } from "../store/useAuthStore";
// import { useNotificationStore } from "../store/useNotificationStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { ParticipantList } from "../components/groups/ParticipantList";
import { InviteModal } from "../components/groups/InviteModal";
import { DrawAnimation } from "../components/draw/DrawAnimation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "../lib/supabase"; // Added supabase import

import { useToast } from "../hooks/useToast";

export const GroupDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    getGroup,
    currentGroup,
    isLoading,
    removeParticipant,
    draw,
    inviteUser,
    deleteGroup,
    leaveGroup,
    transferOwnership,
  } = useGroupStore();
  const user = useAuthStore((state) => state.user);

  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] =
    React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [selectedParticipantForWishlist, setSelectedParticipantForWishlist] =
    React.useState<Participant | null>(null);

  const [isRemoveParticipantModalOpen, setIsRemoveParticipantModalOpen] =
    React.useState(false);
  const [participantToRemove, setParticipantToRemove] =
    React.useState<Participant | null>(null);

  const [isRedrawModalOpen, setIsRedrawModalOpen] = React.useState(false);
  const [redrawConfirmationText, setRedrawConfirmationText] =
    React.useState("");
  const [isLeaveModalOpen, setIsLeaveModalOpen] = React.useState(false); // Added isLeaveModalOpen state
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [selectedNewAdmin, setSelectedNewAdmin] =
    React.useState<Participant | null>(null);

  const handleRedraw = async () => {
    if (!id) return;
    setIsDrawing(true);
    await draw(id);
    setIsDrawing(false);
    setIsRedrawModalOpen(false);
    setRedrawConfirmationText("");
    // Optionally reset local storage for everyone or just notify
  };

  const handleLeaveGroup = async () => {
    if (!id) return;
    try {
      await leaveGroup(id);
      addToast({
        type: "success",
        title: "Saiu do grupo",
        message: "Você saiu do grupo com sucesso.",
      });
      navigate("/groups");
    } catch (error) {
      console.error(error);
      addToast({
        type: "error",
        title: "Erro",
        message: "Erro ao sair do grupo.",
      });
    }
  };

  const handleTransferOwnership = async () => {
    if (!id || !selectedNewAdmin || !selectedNewAdmin.userId) return;
    try {
      await transferOwnership(id, selectedNewAdmin.userId);
      addToast({
        type: "success",
        title: "Admin Transferido",
        message: `Admin transferido para ${selectedNewAdmin.name}.`,
      });
      setIsTransferModalOpen(false);
      setSelectedNewAdmin(null);
    } catch (error) {
      console.error(error);
      addToast({
        type: "error",
        title: "Erro",
        message: "Erro ao transferir admin.",
      });
    }
  };

  const myParticipant = React.useMemo(() => {
    return currentGroup?.participants.find((p) => p.userId === user?.id);
  }, [currentGroup, user]);

  const myMatch = React.useMemo(() => {
    return currentGroup?.participants.find(
      (p) => p.id === myParticipant?.assignedToId,
    );
  }, [currentGroup, myParticipant]);

  const sortedParticipants = React.useMemo(() => {
    if (!currentGroup) return [];
    return [...currentGroup.participants].sort((a, b) => {
      const isA = a.userId === user?.id;
      const isB = b.userId === user?.id;

      if (isA && !isB) return -1;
      if (!isA && isB) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [currentGroup, user]);

  // Realtime Subscription
  React.useEffect(() => {
    if (!id) return;

    getGroup(id);

    // Subscribe to group_members changes
    const channel = supabase
      .channel(`group-members-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_members",
          filter: `group_id=eq.${id}`,
        },
        () => {
          getGroup(id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, getGroup]);

  // const { findUserByHandle } = useAuthStore();
  // const { addNotification } = useNotificationStore();

  const handleInvite = async (value: string) => {
    if (!id) return;

    try {
      await inviteUser(id, value);

      addToast({
        type: "success",
        title: "Convite Enviado",
        message: `Convite enviado com sucesso para ${value}!`,
      });
      setIsInviteModalOpen(false);
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  };

  const handleDraw = async () => {
    if (!id) return;
    setIsDrawing(true);
    await draw(id);
    setIsDrawing(false);
    // Navigate to reveal page or show success
  };

  const handleDeleteGroup = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteGroup(id);
      navigate("/groups", { replace: true });
    } catch (error) {
      console.error("Failed to delete group:", error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christmas-red"></div>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-christmas-wine border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Excluindo grupo...</p>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="p-8 text-center">
        <p>Grupo não encontrado.</p>
        <Button onClick={() => navigate("/groups")} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === currentGroup.ownerId || currentGroup.id === "4";
  const isDrawn = currentGroup.status === "drawn";

  return (
    <div className="p-4 space-y-6 pb-48">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/groups")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-display font-bold text-christmas-wine truncate">
              {currentGroup.name}
            </h1>
            <p className="text-sm text-gray-500 truncate">
              {currentGroup.description}
            </p>
          </div>
        </div>

        {isOwner ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsInviteModalOpen(true)}
              size="sm"
              className="w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Convidar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-christmas-gold text-christmas-gold hover:bg-christmas-gold/10 w-full sm:w-auto justify-center"
              onClick={() => setIsTransferModalOpen(true)}
            >
              <Crown className="w-4 h-4 mr-2" />
              Transferir Admin
            </Button>
            {isDrawn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRedrawModalOpen(true)}
                className="border-christmas-wine text-christmas-wine hover:bg-christmas-wine/10 w-full sm:w-auto justify-center"
              >
                Sortear Novamente
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setIsLeaveModalOpen(true)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Grupo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <Calendar className="w-6 h-6 text-christmas-green" />
          <span className="text-sm font-medium">
            <span className="text-sm font-medium">
              {(() => {
                if (!currentGroup.eventDate) return "Data a definir";
                const date = new Date(currentGroup.eventDate);
                if (isNaN(date.getTime())) return "Data Inválida";
                return format(date, "dd 'de' MMMM", {
                  locale: ptBR,
                });
              })()}
            </span>
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <DollarSign className="w-6 h-6 text-christmas-gold" />
          <span className="text-sm font-medium">
            Até R$ {currentGroup.maxPrice.toFixed(2)}
          </span>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Participantes</h2>
            <span className="text-sm text-gray-500">
              {currentGroup.participants.length} pessoas
            </span>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Somente o administrador pode convidar, remover e sortear.
          </p>
        </div>

        <ParticipantList
          participants={sortedParticipants}
          isOwner={isOwner}
          onRemove={(participantId) => {
            const participant = currentGroup.participants.find(
              (p) => p.id === participantId,
            );
            if (participant) {
              if (isOwner && participant.userId === user?.id) {
                alert(
                  "O administrador não pode sair do grupo. Você deve deletar o grupo se quiser encerrá-lo.",
                );
                return;
              }
              setParticipantToRemove(participant);
              setIsRemoveParticipantModalOpen(true);
            }
          }}
          onViewWishlist={(participant) =>
            setSelectedParticipantForWishlist(participant)
          }
        >
          {(participant) => (
            <div className="min-w-0">
              <p className="font-bold text-gray-900 flex items-center gap-2">
                <span className="truncate">{participant.name}</span>
                {participant.userId === currentGroup.ownerId && (
                  <span className="text-yellow-500 shrink-0" title="Admin">
                    <Crown className="w-4 h-4 fill-current" />
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 font-medium truncate">
                {participant.handle
                  ? `@${participant.handle.replace(/^@/, "")}`
                  : "Convidado"}
              </p>
            </div>
          )}
        </ParticipantList>

        {isOwner && (
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Convidar Amigos
          </Button>
        )}
      </div>

      {isOwner && (
        <div className="pt-8 border-t border-gray-100 mb-8">
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar Grupo
          </Button>
        </div>
      )}

      {/* Explicit spacer for mobile floating button */}
      <div className="h-24 md:hidden" />

      {/* Floating Action Button for Draw or View Result */}
      <div className="fixed bottom-6 left-0 right-0 md:left-72 px-4 flex justify-center z-20">
        {isDrawn ? (
          <Button
            size="lg"
            className="w-full max-w-md shadow-xl"
            onClick={() => {
              if (!myMatch) {
                alert("Erro ao encontrar seu amigo secreto. Tente novamente.");
                return;
              }
              setShowAnimation(true);
            }}
          >
            <Gift className="w-5 h-5 mr-2" />
            Ver meu Amigo Secreto
          </Button>
        ) : isOwner ? (
          <Button
            size="lg"
            className="w-full max-w-md shadow-xl"
            disabled={currentGroup.participants.length < 2}
            onClick={handleDraw}
            isLoading={isDrawing}
          >
            <Gift className="w-5 h-5 mr-2" />
            Realizar Sorteio
          </Button>
        ) : (
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm text-gray-600">
            Aguardando sorteio...
          </div>
        )}
      </div>

      {showAnimation && myMatch && (
        <DrawAnimation
          match={myMatch}
          initialStage="countdown"
          onViewWishlist={() => {
            setShowAnimation(false);
            // Find the full participant object for the match to pass to the modal
            const matchParticipant = currentGroup.participants.find(
              (p) => p.id === myMatch.id,
            );
            if (matchParticipant) {
              setSelectedParticipantForWishlist(matchParticipant);
            }
          }}
          onComplete={() => {
            localStorage.setItem(`hasSeenReveal_${id}_${user?.id}`, "true");
            setShowAnimation(false);
          }}
        />
      )}

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupName={currentGroup.name}
        groupId={currentGroup.id}
        onInvite={handleInvite}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Deletar Grupo"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 text-red-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Ação irreversível</p>
              <p>
                Isso excluirá permanentemente o grupo{" "}
                <strong>{currentGroup.name}</strong> e todos os dados
                associados.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digite <strong>{currentGroup.name}</strong> para confirmar:
            </label>
            <Input
              value={deleteConfirmationName}
              onChange={(e) => setDeleteConfirmationName(e.target.value)}
              placeholder={currentGroup.name}
              className="border-red-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-2/3 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteGroup}
              isLoading={isDeleting}
              disabled={deleteConfirmationName !== currentGroup.name}
            >
              Confirmar Exclusão
            </Button>
          </div>
        </div>
      </Modal>

      {/* Redraw Confirmation Modal */}
      <Modal
        isOpen={isRedrawModalOpen}
        onClose={() => setIsRedrawModalOpen(false)}
        title="Sortear Novamente"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-xl flex items-start gap-3 text-yellow-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Atenção!</p>
              <p>
                Isso irá <strong>desfazer</strong> o sorteio atual e criar novos
                pares. Todos os participantes serão notificados.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digite <strong>sim</strong> para confirmar:
            </label>
            <Input
              value={redrawConfirmationText}
              onChange={(e) => setRedrawConfirmationText(e.target.value)}
              placeholder="sim"
              className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsRedrawModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-2/3 bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={handleRedraw}
              isLoading={isDrawing}
              disabled={redrawConfirmationText.toLowerCase() !== "sim"}
            >
              Confirmar Novo Sorteio
            </Button>
          </div>
        </div>
      </Modal>

      {/* Wishlist Modal */}
      <Modal
        isOpen={!!selectedParticipantForWishlist}
        onClose={() => setSelectedParticipantForWishlist(null)}
        title={`Lista de Presentes de ${selectedParticipantForWishlist?.name}`}
      >
        {selectedParticipantForWishlist?.wishlist &&
        selectedParticipantForWishlist.wishlist.length > 0 ? (
          <div className="space-y-4">
            ```
            {selectedParticipantForWishlist.wishlist.map(
              (item: WishlistItem) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                        >
                          Link Produto
                        </a>
                      )}
                    </div>
                    {item.price && (
                      <span className="font-bold text-christmas-green">
                        R$ {item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Card>
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Esta pessoa ainda não adicionou presentes à lista.</p>
          </div>
        )}
      </Modal>

      {/* Leave Group Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Sair do Grupo"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-xl flex items-start gap-3 text-yellow-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Confirmar saída</p>
              <p>
                Tem certeza que deseja sair do grupo{" "}
                <strong>{currentGroup.name}</strong>? Você precisará ser
                convidado novamente para entrar.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-2/3 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLeaveGroup}
            >
              Sair do Grupo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Transfer Admin Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Transferir Administração"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-blue-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Atenção</p>
              <p>
                Selecione o novo administrador abaixo.{" "}
                <strong>Você perderá seus privilégios de admin</strong>{" "}
                imediatamente após a confirmação.
              </p>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {currentGroup.participants
              .filter((p) => p.userId !== user?.id)
              .map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-colors ${selectedNewAdmin?.id === p.id ? "border-christmas-wine bg-christmas-wine/5 ring-1 ring-christmas-wine" : "border-gray-200 hover:border-christmas-wine/30 hover:bg-gray-50"}`}
                  onClick={() => setSelectedNewAdmin(p)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        <span className="text-xs font-bold">
                          {p.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {p.handle || "Convidado"}
                    </p>
                  </div>
                  {selectedNewAdmin?.id === p.id && (
                    <div className="w-4 h-4 rounded-full bg-christmas-wine flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              ))}

            {currentGroup.participants.length <= 1 && (
              <p className="text-center text-gray-500 py-4 text-sm">
                Não há outros participantes para transferir a liderança.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsTransferModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-2/3 bg-christmas-wine text-white hover:bg-christmas-wine-light"
              onClick={handleTransferOwnership}
              disabled={!selectedNewAdmin}
            >
              Confirmar Transferência
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Participant Confirmation Modal */}
      <Modal
        isOpen={isRemoveParticipantModalOpen}
        onClose={() => setIsRemoveParticipantModalOpen(false)}
        title="Remover Participante"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 text-red-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Confirmar remoção</p>
              <p>
                Tem certeza que deseja remover{" "}
                <strong>{participantToRemove?.name}</strong> (
                {participantToRemove?.handle || "Convidado"}) do grupo?
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsRemoveParticipantModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-2/3 bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (id && participantToRemove) {
                  await removeParticipant(id, participantToRemove.id);
                  setIsRemoveParticipantModalOpen(false);
                  setParticipantToRemove(null);
                }
              }}
            >
              Confirmar Remoção
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
