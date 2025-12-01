import React from "react";
import {
  Shield,
  Lock,
  AlertTriangle,
  Heart,
  Scale,
  ArrowLeft,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 p-6">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/login")}
          className="gap-2 text-gray-600 hover:text-christmas-wine"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-christmas-wine/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scale className="w-8 h-8 text-christmas-wine" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-christmas-wine mb-4">
          Termos de Uso e Legalidade
        </h1>
        <p className="text-gray-600">
          Por favor, leia atentamente os termos abaixo. A utilização do Amigo
          Secreto implica na aceitação integral destas condições.
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {/* 1. Aceitação e Serviço */}
        <Card className="p-6 md:p-8 space-y-4 border-l-4 border-l-christmas-wine">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                1. Aceitação e Natureza do Serviço
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                O "Amigo Secreto" é uma plataforma gratuita de entretenimento
                desenvolvida para facilitar a organização de sorteios. Ao criar
                uma conta, você concorda que o serviço é fornecido "como está"
                (as-is), sem garantias de disponibilidade ininterrupta. Nos
                reservamos o direito de modificar, suspender ou encerrar a
                plataforma (ou sua conta) a qualquer momento, por qualquer
                motivo, sem aviso prévio e sem qualquer tipo de indenização.
              </p>
            </div>
          </div>
        </Card>

        {/* 2. Doações e Pagamentos */}
        <Card className="p-6 md:p-8 space-y-4 border-l-4 border-l-christmas-gold">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-christmas-gold/10 rounded-lg shrink-0">
              <Heart className="w-6 h-6 text-christmas-gold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                2. Política de Doações e Contribuições
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                Todas as contribuições financeiras feitas através da página de
                "Contribua" ou "Donate" são consideradas{" "}
                <strong>doações voluntárias e espontâneas</strong> para apoiar
                os custos de servidor e desenvolvimento. Ao realizar uma doação,
                você declara estar ciente de que:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-sm text-gray-600 ml-2">
                <li>
                  A doação é <strong>irreversível e não reembolsável</strong>{" "}
                  sob nenhuma circunstância.
                </li>
                <li>
                  A doação não confere participação societária, propriedade ou
                  direitos especiais sobre a plataforma.
                </li>
                <li>
                  A doação não garante a continuidade do serviço ou imunidade a
                  bloqueios por violação dos termos.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 3. Privacidade e LGPD */}
        <Card className="p-6 md:p-8 space-y-4 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                3. Privacidade e Proteção de Dados (LGPD)
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                Levamos sua privacidade a sério e estamos em conformidade com as
                melhores práticas de segurança. Seus dados são tratados da
                seguinte forma:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-sm text-gray-600 ml-2">
                <li>
                  <strong>Criptografia de Ponta:</strong> Dados sensíveis, como
                  seu e-mail, são armazenados com criptografia forte (
                  <strong>AES-256</strong> via pgcrypto), garantindo que nem
                  mesmo os administradores do banco de dados tenham acesso ao
                  texto plano.
                </li>
                <li>
                  <strong>Finalidade:</strong> Seus dados são utilizados
                  exclusivamente para o funcionamento do sorteio e notificações
                  do sistema. Não vendemos nem compartilhamos seus dados com
                  terceiros para fins publicitários.
                </li>
                <li>
                  <strong>Direito de Esquecimento:</strong> Você pode excluir
                  sua conta e todos os seus dados permanentemente a qualquer
                  momento através das configurações do perfil.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 4. Conduta e Encerramento */}
        <Card className="p-6 md:p-8 space-y-4 border-l-4 border-l-red-500">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-50 rounded-lg shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                4. Conduta e Encerramento de Conta
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                O uso da plataforma para fins ilícitos, assédio, spam ou
                qualquer atividade que viole a legislação vigente resultará no
                <strong> encerramento imediato e permanente da conta</strong>,
                sem aviso prévio. Nos reservamos o direito de recusar serviço a
                qualquer pessoa, a qualquer momento.
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center pt-8 text-xs text-gray-400">
          <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
          <p className="mt-1">
            Amigo Secreto © {new Date().getFullYear()} - Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
