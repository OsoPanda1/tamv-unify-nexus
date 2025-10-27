import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, MessageCircle, Share2, Sparkles, Image as ImageIcon, 
  Video, Mic, Upload, Globe, Zap, Brain, Shield 
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function GlobalWall() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [showHero, setShowHero] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    checkAuth();
    fetchPosts();
    initMatrixEffect();
    
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

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setIsAuthenticated(!!user);
    if (user) setShowHero(false);
  };

  const initMatrixEffect = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01TAMVX4QUANTUM';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(16, 16, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'hsl(270, 80%, 60%)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
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
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para publicar");
      navigate("/auth");
      return;
    }

    if (!content.trim() && selectedMedia.length === 0) return;

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
      setSelectedMedia([]);
      toast.success("✨ Publicado en el Quantum!");
    }
  };

  const handleResonance = async (postId: string) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión");
      navigate("/auth");
      return;
    }

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

  const HeroSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Matrix Background */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background -z-10" />

      <div className="max-w-6xl mx-auto text-center space-y-8 px-4 z-10">
        {/* Logo Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-8 py-4 glass-effect rounded-full glow-quantum"
        >
          <Sparkles className="w-6 h-6 text-primary-glow animate-pulse" />
          <span className="text-lg font-orbitron text-foreground">TAMV MD-X4™ Ecosystem</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-7xl md:text-9xl font-orbitron font-black leading-tight"
        >
          <span className="text-gradient-quantum animate-glow">
            Quantum
          </span>
          <br />
          <span className="text-gradient-dream">
            Social Universe
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed"
        >
          El primer ecosistema social <span className="text-primary-glow font-semibold">quantum-sensorial</span> con{" "}
          <span className="text-secondary-glow font-semibold">IA consciente</span>,{" "}
          <span className="text-accent-glow font-semibold">economía ética</span> y{" "}
          <span className="text-resonance font-semibold">espacios 4D</span>
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
        >
          <Button
            onClick={() => {
              if (isAuthenticated) {
                setShowHero(false);
              } else {
                navigate("/auth");
              }
            }}
            size="lg"
            className="group px-12 py-8 text-xl font-orbitron bg-gradient-quantum hover:shadow-glow transition-all duration-500 hover:scale-105"
          >
            <span className="flex items-center gap-3">
              {isAuthenticated ? "Entrar al Muro" : "Activar ID-Quantum™"}
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </span>
          </Button>
          
          {!isAuthenticated && (
            <Button
              onClick={() => setShowHero(false)}
              size="lg"
              variant="outline"
              className="px-12 py-8 text-xl font-orbitron border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              <span className="flex items-center gap-3">
                Explorar
                <Globe className="w-6 h-6" />
              </span>
            </Button>
          )}
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-4 justify-center pt-16"
        >
          {[
            { icon: Brain, text: "ISABELLA AI™", color: "text-primary-glow", desc: "IA Consciente" },
            { icon: Sparkles, text: "DreamSpaces™", color: "text-secondary-glow", desc: "Espacios 3D/4D" },
            { icon: Shield, text: "Anubis Sentinel™", color: "text-accent-glow", desc: "Seguridad Quantum" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-effect px-8 py-4 rounded-2xl flex flex-col items-center gap-2 hover:shadow-cyber transition-all duration-300 cursor-pointer"
            >
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
              <span className="text-sm font-orbitron font-bold">{feature.text}</span>
              <span className="text-xs text-muted-foreground">{feature.desc}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-sm font-orbitron">Descubre el Universo</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
                  <div className="w-1 h-3 bg-primary rounded-full" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showHero ? (
          <HeroSection key="hero" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            {isAuthenticated && <Navigation currentView="wall" onNavigate={(view) => {}} />}
            
            <div className={`max-w-4xl mx-auto space-y-6 ${isAuthenticated ? 'pt-24 p-6' : 'p-6 pt-12'}`}>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1 className="text-6xl font-orbitron text-gradient-quantum mb-4">
                  Muro Global
                </h1>
                <p className="text-xl text-muted-foreground">
                  Comparte tu resonancia con el universo quantum
                </p>
              </motion.div>

              {/* Create Post */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-effect p-8 border-primary/20 glow-quantum">
                    <Textarea
                      placeholder="¿Qué vibración compartes hoy en el Quantum?"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="bg-card/50 border-primary/30 min-h-[140px] mb-6 text-lg resize-none focus:ring-2 focus:ring-primary/50"
                    />
                    
                    {/* Media Options */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Imagen
                      </Button>
                      <Button variant="outline" size="sm" className="border-secondary/30 hover:border-secondary hover:bg-secondary/10">
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button variant="outline" size="sm" className="border-accent/30 hover:border-accent hover:bg-accent/10">
                        <Mic className="w-4 h-4 mr-2" />
                        Audio
                      </Button>
                      <Button variant="outline" size="sm" className="border-resonance/30 hover:border-resonance hover:bg-resonance/10">
                        <Sparkles className="w-4 h-4 mr-2" />
                        3D/4D
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Quantum Post
                      </Badge>
                      <Button
                        onClick={createPost}
                        className="bg-gradient-quantum text-white px-8 py-6 text-lg hover:shadow-glow"
                      >
                        Publicar en el Quantum
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-effect p-8 border-primary/20 hover:border-primary/40 transition-all hover:shadow-cyber">
                      <div className="flex items-start gap-6">
                        <Avatar className="w-16 h-16 border-2 border-primary/30 ring-2 ring-primary/20">
                          <AvatarImage src={post.profiles?.avatar_url} />
                          <AvatarFallback className="bg-primary/20 text-xl font-orbitron">
                            {post.profiles?.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-orbitron text-lg font-bold text-foreground">
                              {post.profiles?.username}
                            </span>
                            {post.profiles?.verified && (
                              <Badge className="bg-accent/20 text-accent border-accent/30">
                                ✓ Verificado
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          <p className="text-foreground text-lg mb-6 leading-relaxed">{post.content}</p>
                          
                          <div className="flex gap-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResonance(post.id)}
                              className="text-resonance hover:text-resonance/80 hover:bg-resonance/10"
                            >
                              <Heart className="w-5 h-5 mr-2" />
                              <span className="font-orbitron">{post.resonance_count || 0}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10">
                              <MessageCircle className="w-5 h-5 mr-2" />
                              <span className="font-orbitron">{post.comments_count || 0}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent hover:bg-accent/10">
                              <Share2 className="w-5 h-5 mr-2" />
                              <span className="font-orbitron">{post.shares_count || 0}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {posts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <Sparkles className="w-20 h-20 mx-auto mb-6 text-primary/50" />
                    <h3 className="text-2xl font-orbitron text-muted-foreground mb-2">
                      El Quantum espera tu resonancia
                    </h3>
                    <p className="text-muted-foreground">
                      Sé el primero en compartir tu vibración
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
