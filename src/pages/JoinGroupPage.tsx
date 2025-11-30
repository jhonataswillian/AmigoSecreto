import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Gift, ArrowRight, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/Card";

export const JoinGroupPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { getInviteInfo, joinByInvite } = useGroupStore();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteInfo, setInviteInfo] = useState<{
    groupName: string;
    ownerName: string;
    ownerHandle: string;
  } | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!code) return;
      try {
        const info = await getInviteInfo(code);
        setInviteInfo(info);
      } catch (err: unknown) {
        setError((err as Error).message || "Erro ao carregar convite.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, [code, getInviteInfo]);

  const handleJoin = async () => {
    if (!code) return;

    if (!user) {
      // Redirect to login with return url
      navigate(`/login?returnUrl=/invite/${code}`);
      return;
    }

    setIsJoining(true);
    try {
      const groupId = await joinByInvite(code);
      navigate(`/groups/${groupId}`);
    } catch (err: unknown) {
      setError((err as Error).message || "Erro ao entrar no grupo.");
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-christmas-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christmas-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-christmas-background p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Ops!</h2>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full"
          >
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-christmas-background p-4">
      <Card className="max-w-md w-full p-8 space-y-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-christmas-red via-christmas-gold to-christmas-green" />

        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-christmas-wine/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <Gift className="w-10 h-10 text-christmas-wine" />
          </div>
          <h1 className="text-3xl font-display font-bold text-christmas-wine">
            Convite Especial!
          </h1>
          <p className="text-gray-600">
            Você foi convidado para participar do Amigo Secreto
          </p>
        </div>

        <div className="bg-christmas-wine/5 rounded-2xl p-6 space-y-4 border border-christmas-wine/10">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-700">
              Deseja aceitar o convite de{" "}
              <strong className="text-christmas-wine">
                @{inviteInfo?.ownerHandle?.replace("@", "")}
              </strong>
            </p>
            <p className="text-lg text-gray-700">
              e entrar no grupo{" "}
              <strong className="text-christmas-wine">
                {inviteInfo?.groupName}
              </strong>
              ?
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleJoin}
            className="w-full text-lg py-6 shadow-xl shadow-christmas-wine/20 hover:shadow-christmas-wine/30 transition-all hover:-translate-y-1"
            isLoading={isJoining}
          >
            {user ? "Entrar no Grupo" : "Fazer Login para Entrar"}
            {!isJoining && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>

          <p className="text-xs text-center text-gray-400">
            Ao entrar, você poderá ver os participantes e criar sua lista de
            desejos.
          </p>
        </div>
      </Card>
    </div>
  );
};
