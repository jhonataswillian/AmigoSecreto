import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Gift } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/groups');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setIsLoading(true);
      await login('admin', 'admin');
      navigate('/groups');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-christmas-wine rounded-full mb-4 shadow-lg border-4 border-christmas-gold/20">
          <Gift className="w-10 h-10 text-christmas-gold" />
        </div>
        <h1 className="text-4xl font-display font-bold text-christmas-wine mb-2">
          Amigo Secreto
        </h1>
        <p className="text-gray-600 font-medium">
          A magia do Natal começa aqui
        </p>
      </div>

      <Card className="w-full max-w-sm p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <Link 
              to="/forgot-password"
              className="text-sm text-christmas-wine hover:text-christmas-wine-light font-medium transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-christmas-wine hover:bg-christmas-wine-light text-white shadow-christmas-wine/20" 
            size="lg"
            isLoading={isLoading}
          >
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 font-medium">
                Ou acesse como
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-christmas-wine/20 text-christmas-wine hover:bg-christmas-wine/5"
            onClick={handleAdminLogin}
            disabled={isLoading}
          >
            Admin (Demo)
          </Button>

          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link 
              to="/register" 
              className="text-christmas-wine font-bold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
