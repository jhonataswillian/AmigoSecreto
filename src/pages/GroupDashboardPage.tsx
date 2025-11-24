import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, UserPlus, Gift, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { useGroupStore } from '../store/useGroupStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ParticipantList } from '../components/groups/ParticipantList';
import { InviteModal } from '../components/groups/InviteModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const GroupDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { groups, getGroup, currentGroup, addParticipant, removeParticipant, draw, deleteGroup } = useGroupStore();
  const user = useAuthStore((state) => state.user);
  
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      getGroup(id);
    }
  }, [id, groups, getGroup]); // Re-run if groups change (e.g. after create)

  const { findUserByHandle } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const handleInvite = async (value: string, type: 'email' | 'handle') => {
    if (!id || !currentGroup) return;

    if (type === 'email') {
      await addParticipant(id, {
        name: value.split('@')[0],
        email: value,
      });
      
      addNotification({
        type: 'success',
        title: 'Convite Enviado',
        message: `Convite enviado para ${value}`,
      });
    } else {
      // Handle invite
      const user = await findUserByHandle(value);
      
      if (!user) {
        alert('Usuário não encontrado!');
        throw new Error('Usuário não encontrado');
      }

      // Check if already in group
      if (currentGroup.participants.some(p => p.email === user.email)) {
        alert('Este usuário já está no grupo!');
        throw new Error('Usuário já no grupo');
      }

      await addParticipant(id, {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        userId: user.id,
      });

      addNotification({
        type: 'invite',
        title: 'Você foi convidado!',
        message: `Você foi convidado para o grupo "${currentGroup.name}"`,
        actionLabel: 'Ver Grupo',
        actionLink: `/groups/${id}`,
      });
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
      navigate('/groups', { replace: true });
    } catch (error) {
      console.error('Failed to delete group:', error);
      setIsDeleting(false);
    }
  };

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
        <Button onClick={() => navigate('/groups')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === currentGroup.ownerId;
  const isDrawn = currentGroup.status === 'drawn';

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/groups')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-christmas-wine">
            {currentGroup.name}
          </h1>
          <p className="text-sm text-gray-500">
            {currentGroup.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <Calendar className="w-6 h-6 text-christmas-green" />
          <span className="text-sm font-medium">
            {currentGroup.eventDate 
              ? format(new Date(currentGroup.eventDate), "dd 'de' MMMM", { locale: ptBR })
              : 'Data a definir'}
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Participantes</h2>
          <span className="text-sm text-gray-500">
            {currentGroup.participants.length} pessoas
          </span>
        </div>

        <ParticipantList 
          participants={currentGroup.participants}
          isOwner={isOwner}
          onRemove={(participantId) => id && removeParticipant(id, participantId)}
        />

        <Button 
          variant="outline" 
          className="w-full border-dashed"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Convidar Amigos
        </Button>
      </div>

      {isOwner && (
        <div className="pt-8 border-t border-gray-100">
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

      {/* Floating Action Button for Draw or View Result */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-20">
        {isDrawn ? (
          <Button 
            size="lg" 
            className="w-full max-w-md shadow-xl animate-bounce-subtle"
            onClick={() => navigate(`/groups/${id}/reveal`)}
          >
            <Gift className="w-5 h-5 mr-2" />
            Ver meu Amigo Secreto
          </Button>
        ) : isOwner ? (
          <Button 
            size="lg" 
            className="w-full max-w-md shadow-xl"
            disabled={currentGroup.participants.length < 3}
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

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupName={currentGroup.name}
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
                Isso excluirá permanentemente o grupo <strong>{currentGroup.name}</strong> e todos os dados associados.
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
    </div>
  );
};
