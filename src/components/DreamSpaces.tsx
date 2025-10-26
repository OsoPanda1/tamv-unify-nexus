import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Eye, Users } from "lucide-react";

export const DreamSpaces = () => {
  const spaces = [
    {
      id: 1,
      title: "Quantum Gallery",
      description: "Galería de arte 3D con resonancia emocional",
      gradient: "from-primary via-purple-500 to-pink-500",
      views: "1.2K",
      resonance: 94,
    },
    {
      id: 2,
      title: "Neon Dreams",
      description: "Espacio cyberpunk para eventos virtuales",
      gradient: "from-secondary via-cyan-400 to-blue-500",
      views: "3.5K",
      resonance: 87,
    },
    {
      id: 3,
      title: "Golden Sanctuary",
      description: "Templo digital de meditación colectiva",
      gradient: "from-accent via-yellow-400 to-orange-500",
      views: "890",
      resonance: 96,
    },
    {
      id: 4,
      title: "Aurora Borealis",
      description: "Entorno natural con física cuántica",
      gradient: "from-calm via-blue-400 to-green-400",
      views: "2.1K",
      resonance: 91,
    },
    {
      id: 5,
      title: "Cosmic Concert",
      description: "Sala de streaming con audio 3D KAOS™",
      gradient: "from-energy via-orange-400 to-red-500",
      views: "5.8K",
      resonance: 98,
    },
    {
      id: 6,
      title: "Crystal Palace",
      description: "Universidad TAMV™ ambiente inmersivo",
      gradient: "from-resonance via-pink-400 to-purple-500",
      views: "4.2K",
      resonance: 89,
    },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-dream">
              DreamSpaces™
            </h1>
            <p className="text-muted-foreground text-lg">
              Espacios XR 3D/4D reactivos con trazabilidad emocional
            </p>
          </div>
          
          <Button className="bg-gradient-quantum hover:shadow-glow transition-all duration-300 group">
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            Crear DreamSpace
          </Button>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Card
              key={space.id}
              className="glass-effect overflow-hidden hover:shadow-glow transition-all duration-500 hover:scale-105 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className={`h-48 bg-gradient-to-br ${space.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white/80 animate-float" />
                </div>
                
                {/* Overlay Stats */}
                <div className="absolute top-3 right-3 glass-effect px-3 py-1 rounded-full flex items-center gap-2">
                  <Eye className="w-4 h-4 text-white" />
                  <span className="text-sm font-orbitron text-white">{space.views}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-foreground mb-2">
                    {space.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {space.description}
                  </p>
                </div>

                {/* Resonance Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-orbitron">Resonancia</span>
                    <span className="text-primary-glow">{space.resonance}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${space.gradient} transition-all duration-1000`}
                      style={{ width: `${space.resonance}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 group border-border hover:border-primary transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    Explorar
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-border hover:border-secondary transition-colors"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Section */}
        <Card className="glass-effect p-8 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary-glow animate-pulse" />
          <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-2">
            Crea tu Primer DreamSpace
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Diseña entornos XR únicos con HyperRender™ y activa experiencias multisensoriales 
            con KAOS Audio™ integrado
          </p>
          <Button className="bg-gradient-dream hover:shadow-glow transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" />
            Empezar Ahora
          </Button>
        </Card>
      </div>
    </div>
  );
};
