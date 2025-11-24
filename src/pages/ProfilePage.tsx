import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Save, Edit2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { AvatarEditor } from '../components/profile/AvatarEditor';
import { FRAMES } from '../data/avatars';
import type { Frame } from '../data/avatars';
import { clsx } from 'clsx';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [name, setName] = React.useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = React.useState(user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Santa');
  // In a real app, frame would be stored in user profile. For now, defaulting to none or first one.
  const [selectedFrame, setSelectedFrame] = React.useState<Frame>(FRAMES[0]);
  
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Mock update profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/groups');
  };

  return (
    <div className="p-4 space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-display font-bold text-christmas-wine">
          Meu Perfil
        </h1>
      </div>

      <div className="flex flex-col items-center space-y-6 py-6">
        <div className="relative group">
          <div className={clsx("relative w-40 h-40 rounded-full overflow-hidden transition-all duration-300 shadow-2xl", selectedFrame.class)}>
            <img 
              src={selectedAvatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => setIsEditorOpen(true)}
            className="absolute bottom-0 right-0 p-3 bg-christmas-wine text-white rounded-full shadow-lg hover:bg-christmas-wine-light hover:scale-110 transition-all border-4 border-white"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <Input
          label="Nome de Exibição"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="w-5 h-5" />}
        />
        
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Handle (@usuário)
          </label>
          <div className="flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500">
            <span className="font-bold mr-1">@</span>
            {user?.handle?.replace('@', '') || 'usuario'}
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-1">
            O handle não pode ser alterado.
          </p>
        </div>
      </Card>

      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-20">
        <Button 
          size="lg" 
          className="w-full max-w-md shadow-xl"
          onClick={handleSave}
          isLoading={isLoading}
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <AvatarEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        currentAvatar={selectedAvatar}
        currentFrame={selectedFrame}
        onSave={(avatar, frame) => {
          setSelectedAvatar(avatar);
          setSelectedFrame(frame);
        }}
      />
    </div>
  );
};
