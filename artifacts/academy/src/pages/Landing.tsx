import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetCourses } from "@workspace/api-client-react";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Globe, Sparkles, Trophy, Zap, Users, Star, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { SiPython, SiJavascript, SiTypescript, SiCplusplus, SiRust, SiGo } from "react-icons/si";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  python: SiPython,
  javascript: SiJavascript,
  typescript: SiTypescript,
  cpp: SiCplusplus,
  rust: SiRust,
  go: SiGo,
};

export default function Landing() {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const { data: courses } = useGetCourses();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">{t('جاري التحميل...', 'Loading...')}</p>
        </div>
      </div>
    );
  }
  if (user) return <Redirect to="/dashboard" />;

  const totalLessons = courses?.reduce((sum, c) => sum + (c.totalLessons || 0), 0) || 0;
  const totalCourses = courses?.length || 0;

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-12 sm:py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 start-5 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-5 end-5 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-40 end-20 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t("الأكاديمية الأولى عربياً للبرمجة واللغات", "The #1 Arabic Academy for Coding & Languages")}
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
              <motion.span
                className="bg-gradient-to-l from-primary via-purple-400 to-primary bg-clip-text text-transparent block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {t("كود ماستر", "Code Master")}
              </motion.span>
              <motion.span
                className="text-foreground block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t("رحلتك تبدأ الآن!", "Your Journey Starts Now!")}
              </motion.span>
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 sm:mb-10 leading-relaxed px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t(
                "أكاديمية سمارت فينوم كي — كل درس مفتاح سحري يفتح قواك! تصعد من متعلم الأكواد إلى سيد البرمجة في عالم مليئ بالمهمات والإنجازات.",
                "Smart Venom K Academy — every lesson is a magical key that unlocks your power! Rise from Code Novice to Code Master in a world filled with quests and achievements."
              )}
            </motion.p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mb-8 sm:mb-12">
              <Link href="/register" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                    <Zap className="w-5 h-5 me-2" />
                    {t("ابدأ الرحلة!", "Start Your Quest!")}
                  </Button>
                </motion.div>
              </Link>
              <Link href="/courses" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full border-primary/30 hover:bg-primary/10">
                  {t("استكشف المسارات", "Explore Worlds")}
                </Button>
              </Link>
            </div>

            {/* Fantasy Rank Preview */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { emoji: "🔰", ar: "متعلم", en: "Novice", color: "#94a3b8" },
                { emoji: "🐉", ar: "متدرب", en: "Trainee", color: "#34d399" },
                { emoji: "⚔️", ar: "محارب", en: "Warrior", color: "#818cf8" },
                { emoji: "👑", ar: "سيد", en: "Master", color: "#c084fc" },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
                  style={{ borderColor: `${r.color}40`, backgroundColor: `${r.color}15`, color: r.color }}
                  whileHover={{ scale: 1.1 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ delay: i * 0.2, duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <span className="text-sm">{r.emoji}</span>
                  {t(r.ar, r.en)}
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl w-full">
              {[
                { num: totalCourses + "+", label: t("مسار تعليمي", "Worlds"), icon: BookOpen },
                { num: totalLessons + "+", label: t("مفتاح سحري", "Magic Keys"), icon: Code },
                { num: "∞", label: t("الإنجازات", "Quests"), icon: Zap },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-3xl font-bold">{stat.num}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COURSES PREVIEW */}
      {courses && courses.length > 0 && (
        <section className="py-12 sm:py-20 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold mb-3">
                {t("مساراتنا التعليمية", "Our Learning Tracks")}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("اختر المسار المناسب لك وابدأ من الصفر للاحتراف", "Pick a track and journey from zero to pro")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
              {courses.slice(0, 10).map((c) => {
                const Icon = ICONS[c.slug] || (c.category === 'programming' ? Code : Globe);
                return (
                  <Link key={c.id} href={`/courses/${c.slug}`}>
                    <div
                      className="group p-4 sm:p-5 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col items-center text-center"
                      style={{ borderColor: `${c.color}40` }}
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${c.color}20`, color: c.color }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="font-bold text-sm sm:text-base mb-0.5 line-clamp-1">
                        {t(c.titleAr, c.titleEn)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {c.totalLessons} {t("درس", "lessons")}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center">
              <Link href="/courses">
                <Button variant="outline" size="lg" className="border-primary/30">
                  {t("شاهد كل المسارات", "View All Tracks")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            {t("ليه أكاديمية سمارت فينوم K؟", "Why Smart Venom K?")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Code,    titleAr: "عالم الكود السحري", titleEn: "Magical Code World", descAr: "مسارات 7 لغات برمجة + 3 لغات باشرية منصومة للمتعلم.", descEn: "7 programming tracks + 3 human languages, designed as magical worlds to explore." },
              { icon: Trophy,  titleAr: "مهمات يومية وإنجازات", titleEn: "Daily Quests & Ranks", descAr: "مهمات يومية، ألقاب سحرية، ونظام تحفيز يجعل التعلم مرحا.", descEn: "Daily quests, fantasy ranks, and a reward system that makes learning fun." },
              { icon: Zap,     titleAr: "محرر كود شخصي", titleEn: "Personal Code Editor", descAr: "اكتب وجرّب الكود مباشرة في محرّر كود مدمج مع تشغيل فوري.", descEn: "Write and test code directly in a built-in editor with instant execution." },
              { icon: Users,   titleAr: "لوحة المتصدرين", titleEn: "Hero Leaderboard", descAr: "تنافس مع أبطال الكود واصعد في ترتيب الألقاب السحرية.", descEn: "Compete with fellow code heroes and climb the fantasy rank ladder." },
              { icon: Globe,   titleAr: "عربي + English معاً", titleEn: "Arabic + English Together", descAr: "كل درس بالعربي والإنجليزي في وقت واحد — لا حاجة للتبديل.", descEn: "Every lesson in Arabic and English simultaneously — no need to toggle." },
              { icon: Star,    titleAr: "صوت + رموز إنجاز", titleEn: "Audio + Visual Rewards", descAr: "استمع للشرح صوتياً، الاهتزازات مع النجاح، وتأثيرات بصرية على كل تفاعل.", descEn: "Audio narration, confetti on success, and sound effects on every interaction." },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 40px -10px rgba(124,58,237,0.2)' }}
              >
                <motion.div
                  className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <f.icon className="w-5 h-5" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{t(f.titleAr, f.titleEn)}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{t(f.descAr, f.descEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent border border-primary/30 p-6 sm:p-12 text-center relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,58,237,0.15),transparent)]" />
            <motion.div
              className="text-4xl sm:text-5xl mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔮
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              {t("جاهز تصبح بطل الكود؟", "Ready to Become a Code Hero?")}
            </h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              {t("سجّل مجاناً وابدأ أول مهمة في أقل من دقيقة.", "Sign up free and start your first quest in under a minute. Every step counts toward your legend!")}
            </p>
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="h-12 sm:h-14 px-8 text-base sm:text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  <Wand2 className="w-5 h-5 me-2" />
                  {t("انضم للمغامرة!", "Join the Adventure!")}
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
