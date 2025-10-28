import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { 
  Heart, 
  Users, 
  Sparkles, 
  Settings, 
  Shield,
  Image as ImageIcon,
  Film,
  Grid,
  Calendar
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await fetchProfile(user.id);
    setIsLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setProfile(data);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView="profile" onNavigate={(view) => navigate(`/${view === 'wall' ? '' : view}`)} />
      
      <div className="max-w-6xl mx-auto pt-32 px-4 pb-12 space-y-8">
        {/* Profile Header */}
        <Card className="glass-effect p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="w-32 h-32 border-4 border-primary shadow-glow">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-4xl bg-gradient-quantum text-white">
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-orbitron font-bold">{profile?.username || 'Usuario'}</h1>
                    {profile?.verified && (
                      <Badge className="bg-gradient-quantum">
                        <Shield className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{profile?.full_name || ''}</p>
                </div>
                <Button className="bg-gradient-quantum hover:shadow-glow">
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-orbitron font-bold text-primary-glow">124</p>
                  <p className="text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-orbitron font-bold text-secondary-glow">1.2K</p>
                  <p className="text-muted-foreground">Conexiones</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-orbitron font-bold text-accent-glow">94%</p>
                  <p className="text-muted-foreground">Resonancia</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="posts" className="data-[state=active]:bg-primary/20">
              <Grid className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary/20">
              <ImageIcon className="w-4 h-4 mr-2" />
              Galería
            </TabsTrigger>
            <TabsTrigger value="reels" className="data-[state=active]:bg-primary/20">
              <Film className="w-4 h-4 mr-2" />
              Reels
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20">
              <Calendar className="w-4 h-4 mr-2" />
              Actividad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="glass-effect p-4 hover:shadow-cyber transition-all">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary-glow animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground">Post #{i}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Galería en construcción</p>
            </div>
          </TabsContent>

          <TabsContent value="reels">
            <div className="text-center py-12">
              <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Reels en construcción</p>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Actividad en construcción</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
