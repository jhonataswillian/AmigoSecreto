import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Calendar, LayoutGrid, List, Gift } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useGroupStore } from '../store/useGroupStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { clsx } from 'clsx';

export const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { groups } = useGroupStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'owned' | 'participating'>('all');

  const filteredGroups = groups.filter((g) => {
    const isOwner = g.ownerId === user?.id;
    const isParticipant = g.participants.some((p) => p.userId === user?.id || p.email === user?.email);

    if (filter === 'owned') return isOwner;
    if (filter === 'participating') return isParticipant && !isOwner;
    return isOwner || isParticipant;
  });

  const GroupCard = ({ group }: { group: typeof groups[0] }) => (
    <Card 
      className={clsx(
        "cursor-pointer hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-white/40",
        viewMode === 'list' ? 'flex flex-row items-center p-4 gap-4' : 'p-0'
      )}
      onClick={() => navigate(`/groups/${group.id}`)}
    >
      {/* Status Badge */}
      <div className={clsx(
        "absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-10",
        group.status === 'drawn' 
          ? 'bg-christmas-green text-white' 
          : 'bg-christmas-gold text-christmas-wine'
      )}>
        {group.status === 'drawn' ? 'Sorteado' : 'Aberto'}
      </div>

      {/* Card Content */}
      <div className={clsx(
        viewMode === 'list' ? 'flex-1' : 'p-6 pt-12 space-y-4'
      )}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-display font-bold text-christmas-wine group-hover:text-christmas-wine-light transition-colors">
              {group.name}
            </h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {group.description}
            </p>
          </div>
        </div>

        <div className={clsx(
          "flex items-center text-sm text-gray-500",
          viewMode === 'list' ? 'mt-2 gap-6' : 'justify-between pt-4 border-t border-gray-100'
        )}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-christmas-wine/5 rounded-lg text-christmas-wine">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-medium">{group.participants.length} participantes</span>
          </div>
          
          {group.eventDate && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-christmas-gold/10 rounded-lg text-christmas-gold">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-medium">{new Date(group.eventDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-christmas-wine">
            Seus Grupos
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus sorteios e participe da diversão
          </p>
        </div>
        <Button 
          size="lg" 
          onClick={() => navigate('/groups/create')}
          className="bg-christmas-wine hover:bg-christmas-wine-light text-white shadow-lg shadow-christmas-wine/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Grupo
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/60">
        {/* Filters */}
        <div className="flex p-1 bg-gray-100/50 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex-1 sm:flex-none whitespace-nowrap",
              filter === 'all' 
                ? "bg-white text-christmas-wine shadow-sm" 
                : "text-gray-500 hover:text-christmas-wine"
            )}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('owned')}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex-1 sm:flex-none whitespace-nowrap",
              filter === 'owned' 
                ? "bg-white text-christmas-wine shadow-sm" 
                : "text-gray-500 hover:text-christmas-wine"
            )}
          >
            Meus Grupos
          </button>
          <button
            onClick={() => setFilter('participating')}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex-1 sm:flex-none whitespace-nowrap",
              filter === 'participating' 
                ? "bg-white text-christmas-wine shadow-sm" 
                : "text-gray-500 hover:text-christmas-wine"
            )}
          >
            Grupos Participantes
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-100">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              "p-2 rounded-md transition-colors",
              viewMode === 'grid' ? "bg-christmas-wine/10 text-christmas-wine" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              "p-2 rounded-md transition-colors",
              viewMode === 'list' ? "bg-christmas-wine/10 text-christmas-wine" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredGroups.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-christmas-wine/10 bg-white/30">
          <div className="w-20 h-20 bg-christmas-wine/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-christmas-wine/40" />
          </div>
          <h3 className="text-xl font-bold text-christmas-wine mb-2">
            Nenhum grupo encontrado
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {filter === 'owned' 
              ? "Você ainda não criou nenhum grupo."
              : filter === 'participating'
              ? "Você não está participando de nenhum grupo."
              : "Você não tem grupos ainda."}
          </p>
          {filter !== 'participating' && (
            <Button onClick={() => navigate('/groups/create')}>
              Criar Primeiro Grupo
            </Button>
          )}
        </Card>
      ) : (
        <div className={clsx(
          "grid gap-6",
          viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};
