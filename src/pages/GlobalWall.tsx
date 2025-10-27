import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Sparkles } from "lucide-react";

export default function GlobalWall() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    fetchPosts();
    
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url, verified)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) setPosts(data);
  };

  const createPost = async () => {
    if (!content.trim()) return;

    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user?.id,
        content,
        post_type: 'post',
      });

    if (error) {
      toast.error("Error al publicar");
    } else {
      setContent("");
      toast.success("¡Publicado en el Quantum!");
    }
  };

  const handleResonance = async (postId: string) => {
    const { error } = await supabase
      .from('resonances')
      .insert({
        user_id: user?.id,
        post_id: postId,
        emotion: 'resonance',
      });

    if (error && error.code !== '23505') {
      toast.error("Error al resonar");
    } else {
      toast.success("✨ Resonancia enviada");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-orbitron text-gradient-quantum mb-2">
            Muro Global
          </h1>
          <p className="text-muted-foreground">Comparte tu resonancia con el universo</p>
        </motion.div>

        {/* Create Post */}
        <Card className="glass-effect p-6 border-primary/20 glow-quantum">
          <Textarea
            placeholder="¿Qué vibración compartes hoy?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-card border-primary/30 min-h-[120px] mb-4"
          />
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="border-primary/50">
              <Sparkles className="w-3 h-3 mr-1" />
              Quantum Post
            </Badge>
            <Button
              onClick={createPost}
              className="bg-gradient-quantum text-white"
            >
              Publicar
            </Button>
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect p-6 border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-start gap-4">
                  <Avatar className="border-2 border-primary/30">
                    <AvatarImage src={post.profiles?.avatar_url} />
                    <AvatarFallback className="bg-primary/20">
                      {post.profiles?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-orbitron text-foreground">
                        {post.profiles?.username}
                      </span>
                      {post.profiles?.verified && (
                        <Badge className="bg-accent/20 text-accent border-accent/30">
                          ✓ Verificado
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-foreground mb-4">{post.content}</p>
                    
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResonance(post.id)}
                        className="text-resonance hover:text-resonance/80"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {post.resonance_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Share2 className="w-4 h-4 mr-1" />
                        {post.shares_count || 0}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
