import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useGroupStore } from '../store/useGroupStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const GiftIdeasPage: React.FC = () => {
  const { groupId, participantId } = useParams<{ groupId: string; participantId: string }>();
  const navigate = useNavigate();
  const { groups, getGroup, currentGroup } = useGroupStore();
  
  const [step, setStep] = React.useState(1);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (groupId) {
      getGroup(groupId);
    }
  }, [groupId, groups, getGroup]);

  if (!currentGroup) return null;
  const participant = currentGroup.participants.find(p => p.id === participantId);
  if (!participant) return null;

  const handleAnswer = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <h3 className="text-lg font-bold text-center">Qual o estilo del@?</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Caseiro', 'Aventureiro', 'Geek', 'Sofisticado', 'Esportista', 'Criativo'].map((style) => (
                <button
                  key={style}
                  onClick={() => { handleAnswer('style', style); setStep(2); }}
                  className="p-4 rounded-xl border-2 border-gray-100 hover:border-christmas-wine hover:bg-christmas-wine/5 transition-all text-center font-medium"
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <h3 className="text-lg font-bold text-center">Do que el@ gosta?</h3>
            <div className="space-y-2">
              {['Tecnologia', 'Livros', 'Culinária', 'Decoração', 'Moda', 'Música'].map((interest) => (
                <label key={interest} className="flex items-center p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-christmas-wine rounded focus:ring-christmas-wine" />
                  <span className="ml-3 font-medium">{interest}</span>
                </label>
              ))}
            </div>
            <Button className="w-full mt-4" onClick={() => setStep(3)}>
              Ver Sugestões
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-christmas-gold mx-auto mb-2" />
              <h3 className="text-xl font-bold text-christmas-red">Sugestões Mágicas</h3>
              <p className="text-gray-600">Baseado no perfil {answers.style}</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-christmas-red">
                <h4 className="font-bold">Kit Cinema em Casa</h4>
                <p className="text-sm text-gray-600">Almofada porta-pipoca, copo térmico e gift card de streaming.</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-christmas-green">
                <h4 className="font-bold">Caneca Personalizada</h4>
                <p className="text-sm text-gray-600">Com tema de séries ou filmes que a pessoa gosta.</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-christmas-gold">
                <h4 className="font-bold">Luminária Criativa</h4>
                <p className="text-sm text-gray-600">Para deixar o ambiente mais aconchegante.</p>
              </Card>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
              Recomeçar
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-christmas-red">
            Ideias de Presente
          </h1>
          <p className="text-sm text-gray-500">
            para {participant.name}
          </p>
        </div>
      </div>

      <Card className="p-6 min-h-[400px]">
        {renderStep()}
      </Card>
    </div>
  );
};
