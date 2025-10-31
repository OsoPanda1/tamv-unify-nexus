import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { 
  Settings, 
  Shield,
  Image as ImageIcon,
  MapPin,
  Edit,
  Share2,
  MessageCircle,
  Heart,
  Repeat2,
  Eye
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // CRITICAL: Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
          setIsLoading(false);
        } else {
          navigate("/auth");
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
        setIsLoading(false);
      } else {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        {/* Hero Background with Circular Tech Pattern */}
        <div className="relative h-80 rounded-t-2xl overflow-hidden glass-effect border-b-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 rounded-full border-4 border-primary/30 animate-spin-slow" />
            <div className="absolute w-80 h-80 rounded-full border-4 border-secondary/30 animate-spin-reverse" />
            <div className="absolute w-64 h-64 rounded-full border-4 border-accent/30 animate-spin-slow" />
            <div className="absolute w-48 h-48 rounded-full border-2 border-primary-glow/50 animate-pulse" />
          </div>
          
          {/* Profile Avatar Centered */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              <Avatar className="w-40 h-40 border-8 border-background shadow-2xl shadow-primary/50">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-6xl bg-gradient-quantum text-white">
                  {profile?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary shadow-glow">
                <Edit className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <Card className="glass-effect pt-24 pb-8 px-8 rounded-b-2xl border-t-0">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-4xl font-orbitron font-bold text-gradient-quantum">
                {profile?.username || 'Usuario'}
              </h1>
              {profile?.verified && (
                <Badge className="bg-gradient-quantum border-0 text-lg px-4 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  Elite
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Mexico City, Mexico</span>
            </div>
            
            <p className="text-foreground/80 max-w-2xl mx-auto text-lg">
              As an avid writer and the art photographer I thrive of the intersection of literature and visual ortelling.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center pt-4">
              <Button className="bg-gradient-quantum hover:shadow-glow px-8">
                Follow
              </Button>
              <Button variant="outline" className="border-primary/30">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="border-primary/30">
                Donate
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 justify-center pt-8 pb-4">
              <div className="text-center">
                <p className="text-3xl font-orbitron font-bold text-primary-glow">350</p>
                <p className="text-sm text-muted-foreground">Images</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-orbitron font-bold text-secondary-glow">32.5k</p>
                <p className="text-sm text-muted-foreground">MoƎ/UrePonny</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-primary/20 px-8">
          <button className="flex items-center gap-2 px-4 py-4 border-b-2 border-primary text-primary font-orbitron">
            <Eye className="w-4 h-4" />
            Overview
          </button>
          <button className="flex items-center gap-2 px-4 py-4 border-b-2 border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors">
            <ImageIcon className="w-4 h-4" />
            Gallery
          </button>
          <button className="flex items-center gap-2 px-4 py-4 border-b-2 border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors">
            <Repeat2 className="w-4 h-4" />
            Posts
          </button>
          <button className="flex items-center gap-2 px-4 py-4 border-b-2 border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors">
            <ImageIcon className="w-4 h-4" />
            Reels
          </button>
          <button className="flex items-center gap-2 px-4 py-4 border-b-2 border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors">
            <Heart className="w-4 h-4" />
            Streams
          </button>
          <button className="flex items-center gap-2 px-4 py-4 border-b-2 border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors ml-auto">
            Wishlist
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-6 px-4">
          {/* Left Column - Recent Post */}
          <div className="col-span-12 lg:col-span-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-gradient-quantum flex items-center gap-2">
                  <Repeat2 className="w-5 h-5" />
                  Most recent post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-primary/20">
                      {profile?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-orbitron font-bold">{profile?.username || 'Usuario'}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>Mexico</span>
                    </div>
                  </div>
                  <Badge className="ml-auto bg-gradient-quantum">Elite</Badge>
                </div>
                
                <p className="text-foreground/90">
                  Exploring light and stone to reveal the timeleesness captured within an ancient artwork.
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <button className="flex items-center gap-2 text-primary hover:text-primary-glow transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>1.k</span>
                  </button>
                  <button className="flex items-center gap-2 text-secondary hover:text-secondary-glow transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>45</span>
                  </button>
                  <button className="flex items-center gap-2 text-accent hover:text-accent-glow transition-colors">
                    <Repeat2 className="w-4 h-4" />
                    <span>12</span>
                  </button>
                  <span className="text-muted-foreground ml-auto">contributions</span>
                </div>

                <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
                  View all posts
                </Button>
              </CardContent>
            </Card>

            {/* Gallery Section */}
            <Card className="glass-effect mt-6">
              <CardHeader>
                <CardTitle className="text-gradient-quantum">Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 hover:scale-105 transition-transform cursor-pointer overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ 
                        backgroundImage: `url(https://images.unsplash.com/photo-${1500000000000 + i}?w=200&h=200&fit=crop)`
                      }} />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-primary/30 hover:bg-primary/10">
                  View all images
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Gallery & Wishlist */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-gradient-quantum">Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 hover:scale-105 transition-transform cursor-pointer overflow-hidden shadow-lg">
                      <div className="w-full h-full bg-cover bg-center" style={{ 
                        backgroundImage: `url(https://images.unsplash.com/photo-${1600000000000 + i}?w=400&h=400&fit=crop)`
                      }} />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-primary/30 hover:bg-primary/10">
                  View all images
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-gradient-quantum">Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="glass-effect p-4 hover:shadow-cyber transition-all cursor-pointer">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 mb-3 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ 
                        backgroundImage: `url(https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop)`
                      }} />
                    </div>
                    <p className="font-orbitron font-bold text-sm">Video Microphone</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>4k</span>
                      <Heart className="w-3 h-3 ml-auto" />
                      <span>13</span>
                    </div>
                  </Card>

                  <Card className="glass-effect p-4 hover:shadow-cyber transition-all cursor-pointer">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 mb-3 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ 
                        backgroundImage: `url(https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop)`
                      }} />
                    </div>
                    <p className="font-orbitron font-bold text-sm">Digital Drawing Tablet</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Share2 className="w-3 h-3" />
                      <span>205</span>
                      <MessageCircle className="w-3 h-3 ml-auto" />
                      <span>1k</span>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
