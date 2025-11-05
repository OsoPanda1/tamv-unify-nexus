import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarQuantum from "./components/SidebarQuantum";
import TopBarQuantum from "./components/TopBarQuantum";
import WelcomeMessage from "./components/WelcomeMessage";
import Auth from "./pages/Auth";
import GlobalWall from "./pages/GlobalWall";
import DreamSpaces from "./pages/DreamSpaces";
import Wallet from "./pages/Wallet";
import AudioKaos from "./pages/AudioKaos";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Chats from "./pages/Chats";
import Gallery from "./pages/Gallery";
import Lives from "./pages/Lives";
import Marketplace from "./pages/Marketplace";
import AdminDashboard from "./pages/AdminDashboard";
import KnowledgeSystem from "./pages/KnowledgeSystem";
import University from "./pages/University";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import { Dashboard } from "@/components/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WelcomeMessage />
      <BrowserRouter>
        <div className="min-h-screen flex w-full bg-background">
          <SidebarQuantum />
          <div className="flex-1 lg:ml-[280px]">
            <TopBarQuantum />
            <main className="pt-16 min-h-screen">
              <Routes>
                <Route path="/" element={<GlobalWall />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/lives" element={<Lives />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/knowledge" element={<KnowledgeSystem />} />
                <Route path="/university" element={<University />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dreamspaces" element={<DreamSpaces />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/audio-kaos" element={<AudioKaos />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
