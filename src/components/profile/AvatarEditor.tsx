import React from "react";
import { AVATAR_CATEGORIES, FRAMES } from "../../data/avatars";
import type { Frame } from "../../data/avatars";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { clsx } from "clsx";

interface AvatarEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  currentFrame: Frame;
  onSave: (avatar: string, frame: Frame) => void;
}

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  currentFrame,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = React.useState(currentAvatar);
  const [selectedFrame, setSelectedFrame] = React.useState<Frame>(currentFrame);
  const [activeTab, setActiveTab] = React.useState<"avatars" | "frames">(
    "avatars",
  );
  const [activeCategory, setActiveCategory] = React.useState(
    AVATAR_CATEGORIES[0].id,
  );

  const handleSave = () => {
    onSave(selectedAvatar, selectedFrame);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Avatar">
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex justify-center py-4">
          <div
            className={clsx(
              "relative w-32 h-32 rounded-full overflow-hidden transition-all duration-300",
              selectedFrame.class,
            )}
          >
            <img
              src={selectedAvatar}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            className={clsx(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              activeTab === "avatars"
                ? "bg-white shadow text-christmas-wine"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => setActiveTab("avatars")}
          >
            Escolher Avatar
          </button>
          <button
            className={clsx(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              activeTab === "frames"
                ? "bg-white shadow text-christmas-wine"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => setActiveTab("frames")}
          >
            Escolher Moldura
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {activeTab === "avatars" ? (
            <div className="space-y-4">
              {/* Categories */}
              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {AVATAR_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                      activeCategory === category.id
                        ? "bg-christmas-wine text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Avatars Grid */}
              <div className="grid grid-cols-5 gap-3 max-h-[250px] overflow-y-auto p-1">
                {AVATAR_CATEGORIES.find(
                  (c) => c.id === activeCategory,
                )?.avatars.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={clsx(
                      "relative rounded-full overflow-hidden aspect-square border-2 transition-all hover:scale-105",
                      selectedAvatar === avatar
                        ? "border-christmas-wine ring-2 ring-christmas-wine/30"
                        : "border-transparent hover:border-gray-200",
                    )}
                  >
                    <img
                      src={avatar}
                      alt="Avatar option"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={clsx(
                    "flex flex-col items-center p-3 rounded-xl border-2 transition-all hover:bg-gray-50",
                    selectedFrame.id === frame.id
                      ? "border-christmas-wine bg-christmas-wine/5"
                      : "border-gray-100",
                  )}
                >
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-full bg-gray-200 mb-2",
                      frame.class,
                    )}
                  />
                  <span className="text-xs font-medium text-center text-gray-700">
                    {frame.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" className="w-1/3" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="w-2/3" onClick={handleSave}>
            Salvar Perfil
          </Button>
        </div>
      </div>
    </Modal>
  );
};
