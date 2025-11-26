import React from "react";
import { Trash2, Gift, User as UserIcon } from "lucide-react";
import type { Participant } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { FrameRenderer } from "../profile/FrameRenderer";
import { clsx } from "clsx";

interface ParticipantListProps {
  participants: Participant[];
  isOwner: boolean;
  onRemove: (id: string) => void;
  onViewWishlist: (participant: Participant) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  isOwner,
  onRemove,
  onViewWishlist,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {participants.map((participant) => (
        <Card
          key={participant.id}
          className="p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <div
                className={clsx(
                  "w-full h-full rounded-full overflow-hidden bg-gray-100",
                  participant.frame?.class,
                )}
              >
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
              {participant.frame && <FrameRenderer frame={participant.frame} />}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{participant.name}</h4>
              <p className="text-xs text-gray-500">
                {participant.handle || participant.email || "Convidado"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewWishlist(participant)}
              className="text-christmas-gold hover:bg-christmas-gold/10 hover:text-christmas-gold-dark"
              title="Ver lista de presentes"
            >
              <Gift className="w-4 h-4" />
            </Button>

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
