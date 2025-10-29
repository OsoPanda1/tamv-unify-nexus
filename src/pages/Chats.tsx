import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, Video, Phone, MoreVertical } from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function Chats() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // CRITICAL: Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchChats();
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchChats();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      
      const channel = supabase
        .channel(`messages-${selectedChat.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${selectedChat.id}`
        }, () => {
          fetchMessages(selectedChat.id);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const user = session.user;

    const { data } = await supabase
      .from('chat_members')
      .select(`
        chat_id,
        chats (
          id,
          name,
          chat_type,
          avatar_url,
          updated_at
        )
      `)
      .eq('user_id', user.id);

    if (data) {
      const chatList = data.map(item => item.chats).filter(Boolean);
      setChats(chatList);
    }
  };

  const fetchMessages = async (chatId: string) => {
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        chat_id: selectedChat.id,
        user_id: user?.id,
        content: newMessage,
      });

    if (error) {
      toast.error("Error al enviar mensaje");
    } else {
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView="chats" onNavigate={() => {}} />
      <div className="flex h-screen pt-20">
        {/* Sidebar - Lista de Chats */}
        <div className="w-80 border-r border-primary/20 glass-effect">
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-2xl font-orbitron text-gradient-quantum">Mensajes</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-88px)]">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer border-b border-primary/10 hover:bg-primary/5 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-primary/30">
                    <AvatarImage src={chat.avatar_url} />
                    <AvatarFallback className="bg-primary/20">
                      {chat.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{chat.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.chat_type === 'group' ? 'Grupo' : 'Chat privado'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-primary/20 glass-effect flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-primary/30">
                    <AvatarImage src={selectedChat.avatar_url} />
                    <AvatarFallback className="bg-primary/20">
                      {selectedChat.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-orbitron text-foreground">{selectedChat.name}</h3>
                    <p className="text-xs text-muted-foreground">En línea</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-secondary">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-secondary">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.user_id === user?.id ? 'order-1' : ''}`}>
                        <Card className={`p-4 ${
                          message.user_id === user?.id
                            ? 'bg-primary/20 border-primary/30'
                            : 'glass-effect border-primary/20'
                        }`}>
                          {message.user_id !== user?.id && (
                            <p className="text-xs font-orbitron text-primary mb-1">
                              {message.profiles?.username}
                            </p>
                          )}
                          <p className="text-foreground">{message.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-primary/20 glass-effect">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="bg-card border-primary/30"
                  />
                  <Button onClick={sendMessage} className="bg-gradient-quantum">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-orbitron text-gradient-quantum mb-2">
                  Selecciona un chat
                </h3>
                <p className="text-muted-foreground">
                  Elige una conversación para comenzar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
