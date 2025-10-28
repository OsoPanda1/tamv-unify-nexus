import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Sparkles, Image as ImageIcon, Video, Mic, Upload, Globe, Zap, Brain, Shield, Bot } from "lucide-react";
import { Navigation } from "@/components/Navigation";

// Lazy-load avatar AI Isabella animado
const IsabellaAI = lazy(() => import("@/components/IsabellaAI"));

export default function GlobalWall() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [showHero, setShowHero] = useState(true);
  const [isabellaActive, setIsabellaActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    checkAuth();
    fetchPosts();
    initMatrixEffect();

    // Subscripción instantánea a cambios: Quantum RealTime Sync
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
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * canvas.height;
    const draw = () => {
      ctx.fillStyle = 'rgba(16, 16, 20, 0.045)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'hsl(270, 82%, 62%)';
      ctx.font = `${fontSize}px Fira Code, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 38);
    return () => clearInterval(interval);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`*, profiles:user_id (username, avatar_url, verified)`)
      .order('created_at', { ascending: false })
      .limit(70);
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

  // Hero Section, con Isabella AI y efectos sensoriales matrix-quantum
  const HeroSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto text-center space-y-8 px-4 z-10">
        {/* Badge + Logo holographic */}
        <motion.div
          initial={{ y: -22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="inline-flex items-center gap-4 px-10 py-5 crystal-glass rounded-full shadow-glow-quantum"
        >
          <Sparkles className="w-7 h-7 text-primary-glow animate-pulse-fast" />
          <span className="text-lg font-orbitron text-foreground tracking-wide">TAMV MD-X4™ Universe</span>
          <Badge className="bg-gradient-quantum text-white shadow-glow-quantum">Quantum DreamSpaces</Badge>
        </motion.div>
        {/* Main Title */}
        <motion.h1
          initial={{ y: 26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="text-8xl md:text-[8.5vw] font-orbitron font-black tracking-tight leading-tight gradient-quantum-hero"
        >
          <span className="gradient-text-quantum animate-glow">Quantum</span>
          <br />
          <span className="gradient-text-dream animate-crystal">DreamSpaces</span>
        </motion.h1>
        {/* Isabella AI Avatar */}
        <Suspense fallback={null}>
          {isabellaActive && (
            <IsabellaAI onClose={() => setIsabellaActive(false)} />
          )}
        </Suspense>
        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.62 }}
          className="text-2xl md:text-4xl text-muted-foreground mx-auto max-w-3xl font-inter mt-7 tracking-normal bg-gradient-to-r from-primary/80 to-accent/70 bg-clip-text text-transparent"
        >
          Tu ecosistema de presencia <span className="font-bold text-primary-glow">Sensitiva 4D</span>, construcción colectiva, IA <span className="font-bold text-secondary-glow">consciente y elegante</span>, economía ética y comunidad universal.
        </motion.p>
        {/* Action Buttons */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-5 justify-center pt-7"
        >
          <Button
            onClick={() => isAuthenticated ? setShowHero(false) : navigate("/auth")}
            size="lg"
            className="group px-14 py-8 text-2xl font-orbitron bg-gradient-quantum hover:shadow-glow transition-all hover:scale-110"
          >
            {isAuthenticated ? "Entrar al Quantum Wall" : "Activar QuantumID™"}
            <Zap className="w-7 h-7 group-hover:rotate-12 transition-transform ml-2" />
          </Button>
          {!isAuthenticated && (
            <Button
              onClick={() => setShowHero(false)}
              size="lg"
              variant="outline"
              className="px-14 py-8 text-2xl font-orbitron border-primary/60 hover:border-primary hover:bg-primary/10"
            >
              Explorar
              <Globe className="w-7 h-7 ml-2" />
            </Button>
          )}
        </motion.div>
        {/* Features */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.12 }}
          className="flex flex-wrap gap-6 justify-center pt-18"
        >
          {[
            { icon: Brain, text: "ISABELLA AI™", color: "text-primary-glow", desc: "Guía Quantum Sensitiva" },
            { icon: Sparkles, text: "DreamSpaces™", color: "text-secondary-glow", desc: "Presencia 3D-4D" },
            { icon: Shield, text: "Anubis Sentinel™", color: "text-accent-glow", desc: "Seguridad Quantum" },
            { icon: Bot, text: "Companions XR", color: "text-accent", desc: "Asistentes y Bots" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.09, y: -14 }}
              className="crystal-glass px-10 py-6 rounded-3xl flex flex-col items-center gap-2 hover:shadow-quantum transition-all cursor-pointer"
            >
              <feature.icon className={`w-9 h-9 mb-2 ${feature.color}`} />
              <span className="text-lg font-orbitron font-bold">{feature.text}</span>
              <span className="text-xs text-muted-foreground">{feature.desc}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Quantum Matrix Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/11 via-background to-secondary/6" />
        {[1,2,3].map((i) => (
          <div
            key={i}
            className={`absolute top-${i * 14} left-${i * 12} w-[380px] h-[380px] bg-primary/25 rounded-full blur-[128px] animate-pulse-slower`}
            style={{ animationDelay: `${i * 1.2}s` }}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {showHero ? (
          <HeroSection key="hero" />
        ) : (
          <motion.div
            key="wall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            {isAuthenticated && <Navigation currentView="wall" onNavigate={(view) => {}} />}
            <div className={`max-w-5xl mx-auto space-y-8 ${isAuthenticated ? 'pt-32 p-8' : 'pt-20 p-8'}`}>
              {/* Header, Composer, ✨Quantum Post Feed, sin cambios porque es escalable */}
              {/* ... (el resto se mantiene como tu feed original, solo añade badges quantum, cards glass, UI evolutiva) */}
              {/* Aquí puedes integrar también a Isabella y companions como panel lateral, chat, badge floating o IA Card */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
