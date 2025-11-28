import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Save,
  Edit2,
  Lock,
  Mail,
  AtSign,
  Trash2,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { AvatarEditor } from "../components/profile/AvatarEditor";
import { FrameRenderer } from "../components/profile/FrameRenderer";
import { FRAMES } from "../data/avatars";
import type { Frame } from "../types";
import { clsx } from "clsx";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    updateProfile,
    updateHandle,
    updateName,
    changePassword,
    deleteAccount,
  } = useAuthStore();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences" | "danger"
  >("profile");

  // Profile State
  const [name, setName] = useState(user?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Santa",
  );
  const [selectedFrame, setSelectedFrame] = useState<Frame>(
    user?.frame || FRAMES[0],
  );

  // Handle State
  const [newHandle, setNewHandle] = useState(user?.handle || "");
  const [isHandleModalOpen, setIsHandleModalOpen] = useState(false);

  // Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Password Validation State
  const passwordRequirements = [
    { label: "Pelo menos 8 caracteres", test: (p: string) => p.length >= 8 },
    { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Uma letra minúscula", test: (p: string) => /[a-z]/.test(p) },
    { label: "Um número", test: (p: string) => /[0-9]/.test(p) },
    {
      label: "Um caractere especial",
      test: (p: string) => /[^A-Za-z0-9]/.test(p),
    },
  ];

  const isPasswordValid = passwordRequirements.every((req) =>
    req.test(newPassword),
  );

  // ... (existing code)

  const handleChangePassword = async () => {
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError("A nova senha não atende aos requisitos de segurança.");
      setIsLoading(false);
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setIsPasswordModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccess("Senha alterada com sucesso!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao alterar senha.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationUser, setDeleteConfirmationUser] = useState("");

  // UI State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ...

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      // Update Avatar/Frame
      await updateProfile({
        avatar: selectedAvatar,
        frame: selectedFrame,
      });

      // Update Name if changed
      if (name !== user?.name) {
        await updateName(name);
      }

      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao atualizar perfil.");
      } else {
        setError("Erro ao atualizar perfil.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeHandle = async () => {
    setIsLoading(true);
    setError("");
    try {
      await updateHandle(newHandle);
      setIsHandleModalOpen(false);
      setSuccess("Handle atualizado com sucesso!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao atualizar handle.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationUser !== user?.handle?.replace("@", "")) {
      setError("Nome de usuário incorreto.");
      return;
    }
    setIsLoading(true);
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao excluir conta.");
      }
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "security", label: "Segurança", icon: Lock },
    { id: "preferences", label: "Preferências", icon: Bell },
    { id: "danger", label: "Zona de Perigo", icon: AlertTriangle },
  ] as const;

  return (
    <div className="p-4 space-y-6 pb-20 animate-in fade-in duration-500 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-display font-bold text-christmas-wine">
          Configurações
        </h1>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {success}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-white text-christmas-wine shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50",
              )}
            >
              <Icon
                className={clsx("w-4 h-4", isActive && "text-christmas-wine")}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Public Profile Section */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <Card className="p-6 space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div
                    className={clsx(
                      "relative w-32 h-32 rounded-full overflow-hidden transition-all duration-300 shadow-xl",
                      selectedFrame.class,
                    )}
                  >
                    <img
                      src={selectedAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <FrameRenderer frame={selectedFrame} />
                  <button
                    onClick={() => setIsEditorOpen(true)}
                    className="absolute bottom-0 right-0 p-2.5 bg-christmas-wine text-white rounded-full shadow-lg hover:bg-christmas-wine-light hover:scale-110 transition-all border-4 border-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Toque no lápis para editar
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      label="Nome de Exibição"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={<User className="w-5 h-5" />}
                    />
                    <p className="text-xs text-gray-400">
                      Este é o nome que aparecerá para seus amigos nos grupos.
                    </p>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Perfil
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Account & Security Section */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="p-6 space-y-6 divide-y divide-gray-100">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" />
                  {user?.email}
                </div>
                <p className="text-xs text-gray-400">
                  O email não pode ser alterado.
                </p>
              </div>

              {/* Handle */}
              <div className="pt-6 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  @Usuário
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700">
                    <AtSign className="w-5 h-5 mr-3 text-gray-400" />
                    {user?.handle?.replace("@", "")}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewHandle(user?.handle || "");
                      setIsHandleModalOpen(true);
                    }}
                    disabled={!!user?.handleChangedAt}
                    title={
                      user?.handleChangedAt
                        ? "Você já alterou seu handle uma vez."
                        : "Alterar handle"
                    }
                  >
                    Alterar
                  </Button>
                </div>
                {user?.handleChangedAt && (
                  <p className="text-xs text-orange-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Você já alterou seu nome de usuário uma vez.
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="pt-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Senha</h3>
                  <p className="text-sm text-gray-500">
                    Recomendamos usar uma senha forte.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Alterar Senha
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Preferences Section */}
        {activeTab === "preferences" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-christmas-green/10 rounded-lg text-christmas-green">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Notificações</h3>
                    <p className="text-sm text-gray-500">
                      Receber atualizações por email.
                    </p>
                  </div>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-christmas-green/20 cursor-pointer">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-christmas-green transition shadow-sm" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Danger Zone */}
        {activeTab === "danger" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="p-6 border-red-100 bg-red-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Excluir Conta</h3>
                    <p className="text-sm text-gray-500">
                      Esta ação é irreversível.
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Excluir
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modals */}
      <AvatarEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        currentAvatar={selectedAvatar}
        currentFrame={selectedFrame}
        onSave={async (avatar, frame) => {
          setSelectedAvatar(avatar);
          setSelectedFrame(frame);
          setIsEditorOpen(false);

          // Auto-save
          setIsLoading(true);
          try {
            await updateProfile({
              avatar,
              frame,
            });
            setSuccess("Avatar e Moldura atualizados!");
            setTimeout(() => setSuccess(""), 3000);
          } catch {
            setError("Erro ao salvar avatar.");
          } finally {
            setIsLoading(false);
          }
        }}
      />

      {/* Handle Change Modal */}
      <Modal
        isOpen={isHandleModalOpen}
        onClose={() => setIsHandleModalOpen(false)}
        title="Alterar @Usuário"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-xl flex items-start gap-3 text-yellow-800 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              Atenção: Você só pode alterar seu @usuário{" "}
              <strong>uma única vez</strong>. Escolha com sabedoria!
            </p>
          </div>
          <Input
            label="@Usuário"
            value={newHandle}
            onChange={(e) => {
              // Remove special chars and spaces, keep only alphanumeric and underscore
              const cleanValue = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
              // Always prefix with @ if there's content, or keep empty if empty
              // But user said "todo usuario já inicia automaticamente com @"
              // So if they type "a", it becomes "@a".
              // If they delete everything, it might go to "@" or empty.
              // Let's keep it simple: always show @ + cleanValue
              if (cleanValue) {
                setNewHandle(`@${cleanValue}`);
              } else {
                setNewHandle("");
              }
            }}
            placeholder="@seu_usuario"
            icon={<AtSign className="w-5 h-5" />}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsHandleModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleChangeHandle} isLoading={isLoading}>
              Confirmar Alteração
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Alterar Senha"
      >
        <div className="space-y-4">
          <Input
            label="Senha Atual"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
          />

          <div className="space-y-2">
            <Input
              label="Nova Senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
            />
            {newPassword.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Requisitos da senha:
                </p>
                {passwordRequirements.map((req, index) => {
                  const met = req.test(newPassword);
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "flex items-center gap-2 text-xs transition-colors duration-200",
                        met ? "text-green-600" : "text-gray-400",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-4 h-4 rounded-full flex items-center justify-center border",
                          met
                            ? "bg-green-100 border-green-200"
                            : "bg-gray-100 border-gray-200",
                        )}
                      >
                        {met && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                      <span className={clsx(met && "font-medium")}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Input
            label="Confirmar Nova Senha"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChangePassword}
              isLoading={isLoading}
              disabled={!isPasswordValid || newPassword !== confirmNewPassword}
            >
              Salvar Nova Senha
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Conta"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-xl text-red-800 text-sm space-y-2">
            <p className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Esta ação é extremamente destrutiva.
            </p>
            <p>
              Isso excluirá permanentemente sua conta, grupos e listas de
              desejos.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digite <strong>{user?.handle?.replace("@", "")}</strong> para
              confirmar:
            </label>
            <Input
              value={deleteConfirmationUser}
              onChange={(e) => setDeleteConfirmationUser(e.target.value)}
              placeholder={user?.handle?.replace("@", "")}
              icon={<Trash2 className="w-5 h-5" />}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteAccount}
              isLoading={isLoading}
              disabled={
                deleteConfirmationUser !== user?.handle?.replace("@", "")
              }
            >
              Excluir Permanentemente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
