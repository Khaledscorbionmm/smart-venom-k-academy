import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = ["#c084fc", "#facc15", "#fb923c", "#34d399", "#60a5fa", "#f472b6"];

export function ConfettiEffect({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 30 - 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
    const t = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ y: `${p.y}%`, opacity: 1, scale: 1 }}
            animate={{ y: "120%", opacity: 0, scale: 0.5, rotate: Math.random() * 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 + Math.random(), delay: p.delay, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
