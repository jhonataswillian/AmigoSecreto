import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, ArrowLeft } from 'lucide-react';
import { useGroupStore } from '../store/useGroupStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const createGroupSchema = z.object({
  name: z.string().min(3, 'Nome do grupo é obrigatório'),
  description: z.string().optional(),
  eventDate: z.string().optional(),
  maxPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número maior que zero'),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

export const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const createGroup = useGroupStore((state) => state.createGroup);
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
  });

  const onSubmit = async (data: CreateGroupForm) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const groupId = await createGroup({
        name: data.name,
        description: data.description || '',
        eventDate: data.eventDate,
        maxPrice: Number(data.maxPrice),
        ownerId: user.id,
      });
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/groups')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-display font-bold text-christmas-wine">
          Novo Grupo
        </h1>
      </div>

      <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome do Grupo"
            placeholder="Ex: Família Silva 2025"
            icon={<Users className="w-5 h-5" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 ml-1">
              Descrição <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <textarea
              className="w-full rounded-xl border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-christmas-red focus:ring-christmas-red transition-all duration-200 shadow-sm min-h-[100px]"
              placeholder="Uma mensagem legal para o grupo..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data do Evento"
              type="date"
              icon={<Calendar className="w-5 h-5" />}
              error={errors.eventDate?.message}
              {...register('eventDate')}
            />

            <Input
              label="Valor Máximo (R$)"
              type="number"
              step="0.01"
              placeholder="100.00"
              icon={<DollarSign className="w-5 h-5" />}
              error={errors.maxPrice?.message}
              {...register('maxPrice')}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/groups')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
            >
              Criar Grupo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
