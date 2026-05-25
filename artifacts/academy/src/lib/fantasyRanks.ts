// Fantasy RPG Rank System for Code Master journey
export interface Rank {
  level: number;
  nameAr: string;
  nameEn: string;
  color: string;
  emoji: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const RANKS: Rank[] = [
  { level: 1, nameAr: "متعلم الاكواد", nameEn: "Code Novice", color: "#94a3b8", emoji: "🔰", descriptionAr: "بدأت رحلتك في عالم البرمجة", descriptionEn: "Your coding journey begins" },
  { level: 2, nameAr: "مساعد المبرمج", nameEn: "Code Acolyte", color: "#60a5fa", emoji: "📖", descriptionAr: "تعلمت الأساسيات وبدأت تكتشف السحر", descriptionEn: "You've learned the basics and started discovering the magic" },
  { level: 3, nameAr: "متدرب التنين", nameEn: "Dragon Trainee", color: "#34d399", emoji: "🐉", descriptionAr: "تكتسب القوة مع كل درس جديد", descriptionEn: "You gain power with every new lesson" },
  { level: 4, nameAr: "محارب الكود", nameEn: "Code Warrior", color: "#818cf8", emoji: "⚔️", descriptionAr: "تقاتل الأخطاء وتفوز بالمعارك البرمجية", descriptionEn: "You fight bugs and win coding battles" },
  { level: 5, nameAr: "ساحر المتغيرات", nameEn: "Variable Wizard", color: "#a78bfa", emoji: "🪄", descriptionAr: "تتحكم في المتغيرات كأنها طاقة سحرية", descriptionEn: "You control variables like magical energy" },
  { level: 6, nameAr: "فارس التعليمات", nameEn: "Logic Knight", color: "#f472b6", emoji: "🛡️", descriptionAr: "منطقك حاد كالسيف في معركة البرمجة", descriptionEn: "Your logic is sharp as a sword" },
  { level: 7, nameAr: "مهندس الخوارزميات", nameEn: "Algorithm Engineer", color: "#fb923c", emoji: "🔧", descriptionAr: "تبني آلات البرمجة المذهلة", descriptionEn: "You build incredible coding machines" },
  { level: 8, nameAr: "حارس الدالة", nameEn: "Function Guardian", color: "#facc15", emoji: "🏰", descriptionAr: "تحمي الكود بدوال قوية ومحصنة", descriptionEn: "You protect code with powerful functions" },
  { level: 9, nameAr: "مستكشف الكائنات", nameEn: "Object Explorer", color: "#f87171", emoji: "🔍", descriptionAr: "تكتشف عالم الكائنات المخفي", descriptionEn: "You discover the hidden world of objects" },
  { level: 10, nameAr: "سيد البرمجة", nameEn: "Code Master", color: "#c084fc", emoji: "👑", descriptionAr: "وصلت للقمة! أنت أسطورة البرمجة", descriptionEn: "You've reached the top! A coding legend" },
];

export function getRank(level: number): Rank {
  return RANKS[Math.min(level - 1, RANKS.length - 1)] || RANKS[0];
}

export function xpForLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

export function xpToNextLevel(currentXp: number, currentLevel: number): number {
  return Math.max(0, xpForLevel(currentLevel + 1) - currentXp);
}

export function xpProgressPercent(currentXp: number, currentLevel: number): number {
  const current = xpForLevel(currentLevel);
  const next = xpForLevel(currentLevel + 1);
  const gained = currentXp - current;
  const needed = next - current;
  return Math.min(100, Math.max(0, (gained / needed) * 100));
}

// Daily quest system
export interface Quest {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  xpReward: number;
  target: number;
  icon: string;
}

export const DAILY_QUESTS: Quest[] = [
  { id: "complete_lesson", titleAr: "إكمال درس", titleEn: "Complete a Lesson", descriptionAr: "أكمل أي درس في اليوم", descriptionEn: "Complete any lesson today", xpReward: 50, target: 1, icon: "📚" },
  { id: "streak", titleAr: "نار مستمرة", titleEn: "Keep the Fire", descriptionAr: "حافظ على النار متتالية", descriptionEn: "Maintain your daily streak", xpReward: 30, target: 1, icon: "🔥" },
  { id: "quiz_perfect", titleAr: "درجة كاملة", titleEn: "Perfect Quiz", descriptionAr: "حل اختبار بدرجة كاملة", descriptionEn: "Score 100% on a quiz", xpReward: 40, target: 1, icon: "⭐" },
  { id: "code_run", titleAr: "تشغيل الكود", titleEn: "Run Code", descriptionAr: "شغّل الكود بنجاح مرتين", descriptionEn: "Successfully run code twice", xpReward: 25, target: 2, icon: "⚡" },
];
