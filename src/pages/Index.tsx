import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { IsabellaChat } from "@/components/IsabellaChat";
import { DreamSpaces } from "@/components/DreamSpaces";
import { CreditsSystem } from "@/components/CreditsSystem";
import { AnubisSentinel } from "@/components/AnubisSentinel";
import { Navigation, type NavView } from "@/components/Navigation";

type AppView = "hero" | NavView;

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>("hero");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleEnter = () => {
    setIsAuthenticated(true);
    setCurrentView("dashboard");
  };

  const renderView = () => {
    if (!isAuthenticated) {
      return <Hero onEnter={handleEnter} />;
    }

    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "isabella":
        return <IsabellaChat />;
      case "dreamspaces":
        return <DreamSpaces />;
      case "credits":
        return <CreditsSystem />;
      case "sentinel":
        return <AnubisSentinel />;
      default:
        return <Dashboard />;
    }
  };

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

      {isAuthenticated && (
        <Navigation currentView={currentView} onNavigate={setCurrentView} />
      )}

      <main className="relative z-10">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
