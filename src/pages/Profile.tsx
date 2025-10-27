
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Camera, Sparkles, TrendingUp, Github, Linkedin, Instagram, Twitter, Globe
} from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) setProfile(data);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="glass-effect p-8 border-primary/30 glow-quantum">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary/40">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-3xl font-orbitron">
                    {profile.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-primary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-orbitron text-gradient-quantum">
                    @{profile.username}
                  </h1>
                  {profile.verified && (
                    <Badge className="bg-accent/20 text-accent border-accent/30">
                      ✓ Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-foreground">{profile.full_name || "Sin nombre"}</p>
                <p className="text-muted-foreground">{profile.bio || "Sin biografía"}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.website && <span>🔗 {profile.website}</span>}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs: Social Fusion */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-card/30 border border-primary/20">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-effect p-6 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-orbitron text-accent">
                      {profile.resonance_score || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Resonancia</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-effect p-6 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-orbitron text-secondary">Elite</p>
                    <p className="text-sm text-muted-foreground">Nivel</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-effect p-6 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-orbitron text-primary">
                      {profile.credits_balance || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Créditos</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="linkedin">
            <Card className="glass-effect p-6 border-primary/20">
              <p className="text-muted-foreground">Experiencia profesional, logros, educación y certificaciones.</p>
              {/* Aquí puedes mapear datos de experiencia laboral */}
            </Card>
          </TabsContent>

          <TabsContent value="instagram">
            <Card className="glass-effect p-6 border-primary/20">
              <p className="text-muted-foreground">Galería visual, reels, momentos destacados.</p>
              {/* Aquí puedes mapear imágenes o videos */}
            </Card>
          </TabsContent>

          <TabsContent value="twitter">
            <Card className="glass-effect p-6 border-primary/20">
              <p className="text-muted-foreground">Publicaciones, ideas, hilos y menciones.</p>
              {/* Aquí puedes mapear tweets o pensamientos */}
            </Card>
          </TabsContent>

          <TabsContent value="github">
            <Card className="glass-effect p-6 border-primary/20">
              <p className="text-muted-foreground">Repositorios, contribuciones, proyectos técnicos.</p>
              {/* Aquí puedes mapear enlaces a GitHub */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
