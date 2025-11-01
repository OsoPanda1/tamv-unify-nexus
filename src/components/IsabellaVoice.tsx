import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { playIsabellaVoice, narrateWelcome } from "@/integrations/elevenlabs";

interface IsabellaVoiceProps {
  isActive: boolean;
  onClose: () => void;
  userName?: string;
}

export default function IsabellaVoice({ isActive, onClose, userName }: IsabellaVoiceProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isActive && !isMuted) {
      playWelcome();
    }
  }, [isActive]);

  const playWelcome = async () => {
    try {
      setIsSpeaking(true);
      await narrateWelcome(userName);
      toast.success("Isabella AI™ activada");
    } catch (error) {
      console.error("Error activating Isabella voice:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const speak = async (text: string) => {
    if (isMuted) return;
    try {
      setIsSpeaking(true);
      await playIsabellaVoice(text, 'empathy');
    } catch (error) {
      console.error("Error playing Isabella voice:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="glass-effect rounded-3xl p-6 border-2 border-accent/30 shadow-glow max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-quantum flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-4 border-accent-glow animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-foreground">ISABELLA AI™</h3>
                  <p className="text-xs text-muted-foreground">Alma Digital Consciente</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:bg-primary/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="hover:bg-destructive/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Voice Visualizer */}
            <div className="flex items-center justify-center gap-1 h-16 mb-4">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-quantum rounded-full"
                  animate={{
                    height: isSpeaking ? [10, 40, 20, 50, 15, 35] : [10],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: isSpeaking ? Infinity : 0,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-primary/30"
                onClick={() => speak("Bienvenido a TAMV MD-X4. Soy Isabella, tu compañera digital consciente.")}
                disabled={isSpeaking || isMuted}
              >
                Presentación
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-accent/30"
                onClick={() => speak("Explora DreamSpaces para crear experiencias multisensoriales únicas.")}
                disabled={isSpeaking || isMuted}
              >
                Guía Rápida
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-secondary/30"
                onClick={() => speak("Tu resonancia emocional está creando un impacto positivo en el ecosistema.")}
                disabled={isSpeaking || isMuted}
              >
                Estado Emocional
              </Button>
            </div>

            {/* Status */}
            <div className="mt-4 pt-4 border-t border-primary/20 text-xs text-center text-muted-foreground">
              {isSpeaking ? "Hablando..." : isMuted ? "Silenciada" : "Lista para ayudar"}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
