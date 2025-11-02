import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuantumSidebar } from "@/components/QuantumSidebar";
import Auth from "./pages/Auth";
import GlobalWall from "./pages/GlobalWall";
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
      <BrowserRouter>
        <QuantumSidebar>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QuantumSidebar>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
