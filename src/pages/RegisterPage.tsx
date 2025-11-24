import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, AtSign, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

const registerSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    handle: z
      .string()
      .min(3, "Handle deve ter no mínimo 3 caracteres")
      .regex(
        /^@[a-zA-Z0-9_]+$/,
        "Handle deve começar com @ e conter apenas letras, números e underline",
      ),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      await registerUser(data.name, data.email, data.password, data.handle);
      navigate("/groups");
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("@handle")) {
        setError("handle", { message: error.message });
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-christmas-wine mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-600">Junte-se à magia do Natal!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            icon={<User className="w-5 h-5" />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Seu @handle"
            placeholder="@seu_nome"
            icon={<AtSign className="w-5 h-5" />}
            error={errors.handle?.message}
            {...register("handle")}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••"
            icon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="••••••"
            icon={<Lock className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            className="w-full mt-6"
            size="lg"
            isLoading={isLoading}
          >
            Criar Conta <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-bold text-christmas-green hover:text-christmas-green-dark transition-colors"
            >
              Fazer Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
