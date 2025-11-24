import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, ExternalLink } from 'lucide-react';
import { useGroupStore } from '../store/useGroupStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DrawAnimation } from '../components/draw/DrawAnimation';

export const DrawRevealPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { groups, getGroup, currentGroup } = useGroupStore();
  const user = useAuthStore((state) => state.user);
  
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      getGroup(id);
    }
  }, [id, groups, getGroup]); // Dependencies were already correct. No change needed here based on linting.

  if (!currentGroup || !user) return null;

  const myParticipant = currentGroup.participants.find(p => p.userId === user.id || p.email === user.email);
  const myMatch = currentGroup.participants.find(p => p.id === myParticipant?.assignedToId);

  if (!myParticipant || !myMatch) {
    return (
      <div className="p-8 text-center">
        <p>Você não está participando deste sorteio ou ele ainda não aconteceu.</p>
        <Button onClick={() => navigate(`/groups/${id}`)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  if (showAnimation) {
    return <DrawAnimation onComplete={() => setShowAnimation(false)} />;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => navigate(`/groups/${id}`)}
          className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="text-center mb-8 relative z-10">
        <h1 className="text-3xl font-display font-bold text-christmas-wine mb-2">
          Seu Amigo Secreto é...
        </h1>
        <p className="text-gray-600">
          Prepare o presente com carinho!
        </p>
      </div>

      <Card className="w-full max-w-sm relative z-10 overflow-visible">
        {!revealed ? (
          <div className="text-center py-12">
            <Gift className="w-24 h-24 text-christmas-red mx-auto mb-6 animate-bounce" />
            <Button 
              size="lg" 
              onClick={() => setRevealed(true)}
              className="animate-pulse"
            >
              Revelar Agora
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-32 h-32 rounded-full bg-christmas-green mx-auto mb-6 overflow-hidden border-4 border-christmas-gold shadow-lg">
              <img 
                src={myMatch.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${myMatch.name}`} 
                alt={myMatch.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {myMatch.name}
            </h2>
            <p className="text-gray-500 mb-6">
              {myMatch.email}
            </p>

            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => navigate(`/groups/${id}/wishlist/${myMatch.id}`)}
              >
                <Gift className="w-4 h-4 mr-2" />
                Ver Lista de Desejos
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/groups/${id}/ideas/${myMatch.id}`)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Sugestões de Presente
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
