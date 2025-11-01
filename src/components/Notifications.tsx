import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Heart, MessageCircle, Users, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'resonance' | 'comment' | 'follow' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: any;
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'resonance',
      title: 'Nueva resonancia',
      message: 'A @quantum_dreamer le resonó tu publicación',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      icon: Heart
    },
    {
      id: '2',
      type: 'comment',
      title: 'Nuevo comentario',
      message: '@phoenix_protocol comentó en tu DreamSpace',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      icon: MessageCircle
    },
    {
      id: '3',
      type: 'follow',
      title: 'Nuevo seguidor',
      message: '@anubis_guardian te está siguiendo',
      timestamp: new Date(Date.now() - 1200000),
      read: true,
      icon: Users
    },
    {
      id: '4',
      type: 'achievement',
      title: '¡Logro desbloqueado!',
      message: 'Has alcanzado el nivel Quantum Explorer',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
      icon: Award
    },
    {
      id: '5',
      type: 'system',
      title: 'Isabella AI™',
      message: 'Tu perfil emocional ha evolucionado positivamente',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      icon: Sparkles
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Ahora';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`;
    return `Hace ${Math.floor(seconds / 86400)}d`;
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'resonance': return 'text-pink-400';
      case 'comment': return 'text-blue-400';
      case 'follow': return 'text-purple-400';
      case 'achievement': return 'text-yellow-400';
      case 'system': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-primary/20"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-14 w-96 z-50"
          >
            <div className="glass-effect rounded-2xl border-2 border-primary/30 shadow-glow overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-primary/20 flex items-center justify-between">
                <h3 className="font-orbitron font-bold text-foreground">Notificaciones</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-accent-glow hover:text-accent"
                  >
                    Marcar todas como leídas
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No hay notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y divide-primary/10">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer relative ${
                          !notification.read ? 'bg-accent/5' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${getTypeColor(notification.type)} mt-1`}>
                            <notification.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-sm text-foreground">
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 hover:bg-destructive/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                              {getTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent-glow rounded-full" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              <div className="p-3 border-t border-primary/20 text-center">
                <Button variant="ghost" size="sm" className="text-xs text-accent-glow">
                  Ver todas las notificaciones
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
