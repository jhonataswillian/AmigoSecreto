import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Gift, User, AtSign, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

// --- Validation Schemas ---

const loginSchema = z.object({
  identifier: z.string().min(1, "E-mail ou usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Mínimo 2 caracteres"),
    lastName: z.string().min(2, "Mínimo 2 caracteres"),
    handle: z
      .string()
      .min(3, "Mínimo 3 caracteres")
      .regex(
        /^@[a-zA-Z0-9_]+$/,
        "Deve começar com @ e conter apenas letras, números e _",
      ),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(7, "Mínimo 7 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Deve conter pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

/**
 * AuthPage Component
 *
 * Handles user authentication (login and registration) with a unified interface.
 * Features:
 * - Toggle between Login and Register modes
 * - Smart input detection (Email vs Handle)
 * - Auto-prefixing for handles
 * - Premium UI with Framer Motion animations
 */
export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: registerUser } = useAuthStore();

  // Determine initial mode based on URL path
  const initialMode = location.pathname === "/register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    watch: watchLogin,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Register Form
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
    setError: setRegisterError,
    setValue: setRegisterValue,
    watch: watchRegister,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Handle auto-prefixing @ for handle
  const handleValue = watchRegister("handle");
  React.useEffect(() => {
    if (handleValue && !handleValue.startsWith("@")) {
      setRegisterValue("handle", `@${handleValue}`);
    }
  }, [handleValue, setRegisterValue]);

  // Smart Login Input Logic
  const loginIdentifier = watchLogin("identifier");
  const isEmail =
    loginIdentifier?.includes("@") && !loginIdentifier?.startsWith("@");
  const loginIcon = isEmail ? (
    <Mail className="w-5 h-5" />
  ) : (
    <AtSign className="w-5 h-5" />
  );

  const onLoginSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      let identifier = data.identifier;

      // Auto-prefix @ if it looks like a handle (not an email and doesn't start with @)
      const isLikelyEmail =
        identifier.includes("@") && !identifier.startsWith("@");
      if (!isLikelyEmail && !identifier.startsWith("@")) {
        identifier = `@${identifier}`;
      }

      await login(identifier, data.password);
      navigate("/groups");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      await registerUser(fullName, data.email, data.password, data.handle);
      navigate("/groups");
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("@handle")) {
        setRegisterError("handle", { message: error.message });
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setIsLoading(true);
      await login("admin", "admin");
      navigate("/groups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    window.history.pushState(null, "", `/${newMode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-red-50 to-white overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-christmas-red/5 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-20 w-72 h-72 bg-christmas-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Header / Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-christmas-wine rounded-full mb-6 shadow-xl border-4 border-christmas-gold/20 relative group">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <Gift className="w-12 h-12 text-christmas-gold drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h1 className="text-5xl font-display font-bold text-christmas-wine mb-3 tracking-tight">
          Amigo Secreto
        </h1>
        <p className="text-gray-600 font-medium text-lg">
          A magia do Natal começa aqui
        </p>
      </motion.div>

      <Card className="w-full max-w-md p-1 bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl rounded-3xl relative z-10">
        <div className="p-6 sm:p-8">
          {/* Toggle Header */}
          <div className="relative flex bg-gray-100/50 p-1 rounded-xl mb-8">
            <div
              className={clsx(
                "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-spring",
                mode === "login" ? "left-1" : "left-[calc(50%+2px)]",
              )}
            />
            <button
              className={clsx(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors relative z-10",
                mode === "login"
                  ? "text-christmas-wine"
                  : "text-gray-500 hover:text-gray-700",
              )}
              onClick={() => handleModeChange("login")}
            >
              Login
            </button>
            <button
              className={clsx(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors relative z-10",
                mode === "register"
                  ? "text-christmas-wine"
                  : "text-gray-500 hover:text-gray-700",
              )}
              onClick={() => handleModeChange("register")}
            >
              Cadastro
            </button>
          </div>

          {/* Forms Container */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmitLogin(onLoginSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Input
                      label="E-mail ou Usuário"
                      placeholder="seu@email.com ou @usuario"
                      icon={loginIcon}
                      error={loginErrors.identifier?.message}
                      {...registerLogin("identifier")}
                      className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                    />

                    <div className="space-y-1">
                      <Input
                        label="Senha"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="w-5 h-5" />}
                        error={loginErrors.password?.message}
                        {...registerLogin("password")}
                        className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => navigate("/forgot-password")}
                          className="text-xs text-christmas-wine hover:text-christmas-wine-light font-medium transition-colors"
                        >
                          Esqueceu a senha?
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-christmas-wine hover:bg-christmas-wine-light text-white shadow-lg shadow-christmas-wine/20 py-6 text-base"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Entrar
                  </Button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-gray-400 font-medium">
                        Ou
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs border-dashed border-gray-300 text-gray-500 hover:text-christmas-wine hover:border-christmas-wine/30 hover:bg-christmas-wine/5"
                    onClick={handleAdminLogin}
                    disabled={isLoading}
                  >
                    Acessar como Admin (Demo)
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmitRegister(onRegisterSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Nome"
                      placeholder="João"
                      icon={<User className="w-5 h-5" />}
                      error={registerErrors.firstName?.message}
                      {...registerRegister("firstName")}
                      className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                    />
                    <Input
                      label="Sobrenome"
                      placeholder="Silva"
                      error={registerErrors.lastName?.message}
                      {...registerRegister("lastName")}
                      className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <Input
                    label="@Usuário"
                    placeholder="@joao_silva"
                    icon={<AtSign className="w-5 h-5" />}
                    error={registerErrors.handle?.message}
                    {...registerRegister("handle")}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    icon={<Mail className="w-5 h-5" />}
                    error={registerErrors.email?.message}
                    {...registerRegister("email")}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                  />

                  <Input
                    label="Senha"
                    type="password"
                    placeholder="•••••••"
                    icon={<Lock className="w-5 h-5" />}
                    error={registerErrors.password?.message}
                    {...registerRegister("password")}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                  />
                  <p className="text-xs text-gray-500 -mt-2 pl-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    Mínimo 7 caracteres, 1 maiúscula, 1 minúscula, 1 número.
                  </p>

                  <Input
                    label="Confirmar Senha"
                    type="password"
                    placeholder="•••••••"
                    icon={<Lock className="w-5 h-5" />}
                    error={registerErrors.confirmPassword?.message}
                    {...registerRegister("confirmPassword")}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                  />

                  <Button
                    type="submit"
                    className="w-full mt-4 bg-christmas-wine hover:bg-christmas-wine-light text-white shadow-lg shadow-christmas-wine/20 py-6 text-base"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Criar Conta <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
};
