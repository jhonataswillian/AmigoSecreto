import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Mail, Info, CheckCircle } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { clsx } from 'clsx';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'invite': return <Mail className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-christmas-gold" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-christmas-wine">
          Notificações
        </h1>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-12 border-dashed border-2 border-christmas-wine/10 bg-white/30">
          <div className="w-20 h-20 bg-christmas-wine/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-christmas-wine/40" />
          </div>
          <h3 className="text-xl font-bold text-christmas-wine mb-2">
            Tudo limpo por aqui!
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Você não tem novas notificações no momento. Aproveite para verificar seus grupos.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={clsx(
                "transition-all duration-300 overflow-hidden",
                !notification.read 
                  ? "border-l-4 border-l-christmas-wine bg-white shadow-md" 
                  : "opacity-70 hover:opacity-100 bg-white/50"
              )}
            >
              <div className="flex items-start gap-4 p-4">
                <div className={clsx(
                  "mt-1 p-2 rounded-full shadow-sm",
                  !notification.read ? "bg-christmas-wine/10" : "bg-gray-100"
                )}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={clsx("font-bold text-lg", !notification.read ? "text-christmas-wine" : "text-gray-700")}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {new Date(notification.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-1 mb-3">
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-3">
                    {notification.actionLabel && notification.actionLink && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          markAsRead(notification.id);
                          navigate(notification.actionLink!);
                        }}
                      >
                        {notification.actionLabel}
                      </Button>
                    )}
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-gray-500 hover:text-christmas-green transition-colors"
                      >
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
