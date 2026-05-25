import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { X, Sparkles, Play, Flame } from "lucide-react";

const MESSAGES = [
  { ar: "أهلاً بك! أنا دليلك السحري! 🐉", en: "Hi! I'm your magical dragon guide! 🐉" },
  { ar: "كل درس هو مفتاح قوي يجعلك أقوى!", en: "Each lesson is a powerful key that makes you stronger!" },
  { ar: "لا تنس: الاستمرار يفتح المزيد من الإنجازات!", en: "Don't forget: consistency unlocks more achievements!" },
  { ar: "اغمض عينيك واشرح المحتوى بصوت عال! 🔮", en: "Use me to read lessons aloud and navigate! 🔮" },
];

export function FloatingMascot() {
  const [open, setOpen] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const { playSound } = useSound();

  const nextMsg = () => {
    setMsgIdx((i) => (i + 1) % MESSAGES.length);
    playSound("click");
  };

  const message = MESSAGES[msgIdx];

  return (
    <>
      {/* Mascot Button */}
      <motion.button
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary via-purple-500 to-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 border-2 border-white/20"
        onClick={() => { setOpen(!open); playSound("click"); }}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { duration: 2, repeat: Infinity } }}
        title="Dragon Guide"
      >
        <span className="text-2xl">🐉</span>
      </motion.button>

      {/* Speech Bubble */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-40 right-4 md:bottom-24 md:right-6 z-50 w-72 bg-card border border-primary/30 rounded-2xl shadow-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0">🐉</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold mb-1 text-primary flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  دليلك السحري / Dragon Guide
                </div>
                <p className="text-sm text-foreground/90 mb-1" dir="rtl">{message.ar}</p>
                <p className="text-xs text-muted-foreground">{message.en}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={nextMsg}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <Flame className="w-3 h-3" />
                    أكمل / Next
                  </button>
                  <button
                    onClick={() => {
                      const audio = new Audio('/speech_welcome_arabic.mp3');
                      audio.play();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    صوت / Audio
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 left-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
