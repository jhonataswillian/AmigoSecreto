import React from "react";
import { Trash2, Gift, User as UserIcon } from "lucide-react";
import type { Participant } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface ParticipantListProps {
  participants: Participant[];
  isOwner: boolean;
  onRemove: (id: string) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  isOwner,
  onRemove,
}) => {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum participante ainda.</p>
        <p className="text-sm">Convide amigos para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {participants.map((participant) => (
        <Card
          key={participant.id}
          className="p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-christmas-green/20">
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <UserIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{participant.name}</h4>
              <p className="text-xs text-gray-500">
                {participant.email || "Convidado"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {participant.wishlist.length > 0 && (
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600"
                title="Tem lista de desejos"
              >
                <Gift className="w-4 h-4" />
              </div>
            )}

            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(participant.id)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
