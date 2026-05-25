import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { getRank } from "@/lib/fantasyRanks";
import { useSound } from "@/contexts/SoundContext";

interface Props {
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, onClose }: Props) {
  const [visible, setVisible] = useState(true);
  const rank = getRank(newLevel);
  const { playSound, playNarration } = useSound();

  useEffect(() => {
    if (visible) {
      playSound("levelUp");
      playNarration("lesson_done_ar");
    }
  }, [visible, playSound, playNarration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card border-2 border-primary/30 rounded-2xl p-6 sm:p-10 max-w-md w-full text-center relative overflow-hidden"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl"
              style={{ backgroundColor: rank.color }}
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10"
              onClick={() => { setVisible(false); onClose(); }}
            >
              <X className="w-5 h-5" />
            </Button>

            <motion.div
              className="text-6xl sm:text-7xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {rank.emoji}
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ backgroundColor: `${rank.color}30`, color: rank.color, border: `1px solid ${rank.color}50` }}
            >
              <Sparkles className="w-3 h-3" />
              LEVEL UP!
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {rank.nameAr}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              {rank.nameEn}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {rank.descriptionAr}
            </p>

            <Button
              onClick={() => { setVisible(false); onClose(); }}
              className="w-full"
              style={{ backgroundColor: rank.color, color: "#fff" }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              استمر في الرحلة! / Continue!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
