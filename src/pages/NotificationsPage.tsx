import React, { useEffect } from "react";
import {
  useNotificationStore,
  type Notification,
} from "../store/useNotificationStore";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    isLoading,
  } = useNotificationStore();

  const { addParticipant } = useGroupStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchNotifications();
    subscribeToNotifications();
    return () => unsubscribeFromNotifications();
  }, [
    fetchNotifications,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  ]);

  const handleAcceptInvite = async (notification: Notification) => {
    if (!user) return;
    try {
      const groupId = (notification.data as { groupId?: string })?.groupId;
      if (!groupId) return;

      await addParticipant(groupId, { userId: user.id });
      await removeNotification(notification.id); // Remove invite after accept
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao aceitar convite. Talvez você já esteja no grupo ou ele não exista mais.",
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-christmas-wine">
            Notificações
          </h1>
          <p className="text-gray-600 mt-1">
            Fique por dentro de tudo que acontece
          </p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" onClick={() => markAllAsRead()}>
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {isLoading && notifications.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-christmas-wine border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Nenhuma notificação
          </h3>
          <p className="text-gray-500 mt-1">
            Você não tem novos avisos ou convites no momento.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={clsx(
                "p-4 transition-all duration-200",
                !notification.read &&
                  "bg-christmas-wine/5 border-christmas-wine/20",
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={clsx(
                    "p-2 rounded-full shrink-0",
                    notification.type === "invite"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4
                        className={clsx(
                          "font-bold",
                          !notification.read
                            ? "text-christmas-wine"
                            : "text-gray-900",
                        )}
                      >
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          {
                            addSuffix: true,
                            locale: ptBR,
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-christmas-wine hover:bg-christmas-wine/10 rounded-full transition-colors"
                          title="Marcar como lida"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {notification.type === "invite" && (
                    <div className="mt-4 flex gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptInvite(notification)}
                        className="bg-christmas-green hover:bg-christmas-green-light text-white"
                      >
                        Aceitar Convite
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
