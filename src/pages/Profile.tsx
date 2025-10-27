import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, Coins, Sparkles, TrendingUp } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setBio(data.bio || "");
      setLocation(data.location || "");
      setWebsite(data.website || "");
    }
  };

  const updateProfile = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        bio,
        location,
        website,
      })
      .eq('id', profile.id);

    if (error) {
      toast.error("Error al actualizar perfil");
    } else {
      toast.success("Perfil actualizado");
      setEditing(false);
      fetchProfile();
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-effect p-8 border-primary/20 glow-quantum">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary/30">
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

              <div className="flex-1 space-y-4">
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

                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-foreground">Nombre</Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-card border-primary/30"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Bio</Label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-card border-primary/30"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Ubicación</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-card border-primary/30"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Sitio Web</Label>
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="bg-card border-primary/30"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={updateProfile} className="bg-gradient-quantum">
                        Guardar
                      </Button>
                      <Button onClick={() => setEditing(false)} variant="outline">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xl text-foreground">{profile.full_name || "Sin nombre"}</p>
                    <p className="text-muted-foreground">{profile.bio || "Sin biografía"}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {profile.location && <span>📍 {profile.location}</span>}
                      {profile.website && <span>🔗 {profile.website}</span>}
                    </div>
                    <Button onClick={() => setEditing(true)} variant="outline">
                      Editar Perfil
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-effect p-6 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-orbitron text-accent">
                  {profile.credits_balance || 0}
                </p>
                <p className="text-sm text-muted-foreground">Créditos</p>
              </div>
            </div>
          </Card>

          <Card className="glass-effect p-6 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-resonance/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-resonance" />
              </div>
              <div>
                <p className="text-2xl font-orbitron text-resonance">
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
        </div>
      </div>
    </div>
  );
}
