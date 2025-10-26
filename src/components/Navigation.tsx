import { Brain, Sparkles, Coins, Shield, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export type NavView = "dashboard" | "isabella" | "dreamspaces" | "credits" | "sentinel";

interface NavigationProps {
  currentView: NavView | "hero";
  onNavigate: (view: NavView) => void;
}

export const Navigation = ({ currentView, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: "dashboard" as NavView, icon: LayoutDashboard, label: "Dashboard", gradient: "from-primary to-primary-glow" },
    { id: "isabella" as NavView, icon: Brain, label: "ISABELLA AI™", gradient: "from-primary to-purple-400" },
    { id: "dreamspaces" as NavView, icon: Sparkles, label: "DreamSpaces™", gradient: "from-secondary to-cyan-400" },
    { id: "credits" as NavView, icon: Coins, label: "TAMV Credits™", gradient: "from-accent to-yellow-400" },
    { id: "sentinel" as NavView, icon: Shield, label: "Anubis™", gradient: "from-resonance to-pink-400" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-quantum flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-gradient-quantum">TAMV</h1>
              <p className="text-xs text-muted-foreground">DM-X4™ Ecosystem</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    relative group overflow-hidden transition-all duration-300
                    ${isActive 
                      ? "bg-gradient-to-r " + item.gradient + " text-white shadow-glow" 
                      : "hover:bg-card-glass"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="font-orbitron text-sm hidden md:inline">{item.label}</span>
                  
                  {!isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  )}
                </Button>
              );
            })}
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-dream border-2 border-primary/50 flex items-center justify-center shadow-glow animate-pulse-slow">
            <span className="text-xs font-orbitron font-bold">ID</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
