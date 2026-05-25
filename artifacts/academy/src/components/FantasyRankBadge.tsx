import { motion } from "framer-motion";
import { getRank } from "@/lib/fantasyRanks";

interface Props {
  level: number;
  xp: number;
  size?: "sm" | "md" | "lg";
}

export function FantasyRankBadge({ level, xp, size = "md" }: Props) {
  const rank = getRank(level);
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center cursor-default`}
      style={{ backgroundColor: `${rank.color}25`, border: `2px solid ${rank.color}` }}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.4 }}
    >
      <span className="select-none">{rank.emoji}</span>
      <div
        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background text-[10px] font-bold flex items-center justify-center border"
        style={{ borderColor: rank.color, color: rank.color }}
      >
        {level}
      </div>
    </motion.div>
  );
}

export function RankProgressBar({ level, xp }: Props) {
  const rank = getRank(level);
  const xpToNext = Math.max(0, Math.pow(level + 1, 2) * 100 - xp);
  const percent = Math.min(100, Math.max(0, ((xp - Math.pow(level, 2) * 100) / (Math.pow(level + 1, 2) * 100 - Math.pow(level, 2) * 100)) * 100));

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold" style={{ color: rank.color }}>
          {rank.nameAr} / {rank.nameEn}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {xpToNext > 0 ? `${xpToNext} XP إلى المستوى التالي` : "Max Level!"}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: rank.color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
