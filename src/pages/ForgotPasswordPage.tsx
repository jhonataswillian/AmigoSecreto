import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSent, setIsSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSent(true);
    // console.log("Recover password for:", data.email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mb-6">
        <Link
          to="/login"
          className="inline-flex items-center text-gray-600 hover:text-christmas-wine transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para login
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-christmas-red mb-2">
          Recuperar Senha
        </h1>
        <p className="text-gray-600">Enviaremos um link para você</p>
      </div>

      <Card className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
        {isSent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verifique seu e-mail
            </h3>
            <p className="text-gray-600 mb-6">
              Enviamos as instruções de recuperação para o seu endereço de
              e-mail.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSent(false)}
            >
              Tentar outro e-mail
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              size="lg"
              isLoading={isLoading}
            >
              Enviar Link
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
