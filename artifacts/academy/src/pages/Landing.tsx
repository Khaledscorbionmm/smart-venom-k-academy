import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetCourses } from "@workspace/api-client-react";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Globe, Sparkles, Trophy, Zap, Users, Star } from "lucide-react";
import { SiPython, SiJavascript, SiTypescript, SiCplusplus, SiRust, SiGo } from "react-icons/si";

const ICONS: Record<string, any> = { SiPython, SiJavascript, SiTypescript, SiCplusplus, SiRust, SiGo };

export default function Landing() {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const { data: courses } = useGetCourses();

  if (isLoading) return null;
  if (user) return <Redirect to="/dashboard" />;

  const totalLessons = courses?.reduce((sum, c) => sum + (c.totalLessons || 0), 0) || 0;
  const totalCourses = courses?.length || 0;

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-12 sm:py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 start-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 end-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t("الأكاديمية الأولى عربياً للبرمجة واللغات", "The #1 Arabic Academy for Coding & Languages")}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-l from-primary via-purple-400 to-primary bg-clip-text text-transparent">
                {t("تعلم البرمجة", "Learn Coding")}
              </span>
              <br />
              <span className="text-foreground">{t("بطريقة لم تعهدها من قبل", "Like Never Before")}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 sm:mb-10 leading-relaxed px-2">
              {t(
                "أكاديمية سمارت فينوم K تقدم أقوى مسارات البرمجة واللغات بالعربي. ابدأ مجاناً واحصل على شهادة معتمدة.",
                "Smart Venom K Academy offers the most powerful tracks in coding and languages in Arabic. Start free and earn certified credentials."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mb-12">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  <Zap className="w-5 h-5 me-2" />
                  {t("ابدأ رحلتك مجاناً", "Start Free")}
                </Button>
              </Link>
              <Link href="/courses" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full border-primary/30 hover:bg-primary/10">
                  {t("استكشف الدورات", "Explore Courses")}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl w-full">
              {[
                { num: totalCourses + "+", label: t("مسار تعليمي", "Tracks"), icon: BookOpen },
                { num: totalLessons + "+", label: t("درس تفاعلي", "Lessons"), icon: Code },
                { num: "100%", label: t("بالعربية", "In Arabic"), icon: Globe },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-3xl font-bold">{stat.num}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
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
                const Icon = ICONS[c.icon] || BookOpen;
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
              { icon: Code,    titleAr: "محتوى احترافي", titleEn: "Professional Content", descAr: "مناهج مصممة بعناية لتناسب سوق العمل العربي والعالمي.", descEn: "Carefully crafted curriculum aligned with the global job market." },
              { icon: Trophy,  titleAr: "نظام XP وألقاب", titleEn: "XP & Achievements", descAr: "اكسب نقاط خبرة وافتح إنجازات مع كل درس تكمله.", descEn: "Earn XP and unlock achievements as you progress." },
              { icon: Zap,     titleAr: "محرر أكواد مدمج", titleEn: "Built-in Code Editor", descAr: "اكتب وجرّب الكود مباشرة بدون أي إعدادات.", descEn: "Write and run code directly with zero setup." },
              { icon: Users,   titleAr: "متصدرين أسبوعي", titleEn: "Weekly Leaderboard", descAr: "تنافس مع آلاف المتدربين على المراكز الأولى.", descEn: "Compete with thousands of trainees for top spots." },
              { icon: Globe,   titleAr: "عربي وإنجليزي", titleEn: "Arabic & English", descAr: "بدّل بين اللغتين في أي وقت بضغطة واحدة.", descEn: "Toggle between Arabic and English anytime." },
              { icon: Star,    titleAr: "دعم WhatsApp", titleEn: "WhatsApp Support", descAr: "تواصل مع فريق الدعم على واتساب على مدار الساعة.", descEn: "Reach our support team on WhatsApp 24/7." },
            ].map((f, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{t(f.titleAr, f.titleEn)}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{t(f.descAr, f.descEn)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-6 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              {t("جاهز تبدأ رحلتك؟", "Ready to start your journey?")}
            </h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              {t("سجّل مجاناً النهاردة وابدأ أول درس في أقل من دقيقة.", "Sign up free today and start your first lesson in under a minute.")}
            </p>
            <Link href="/register">
              <Button size="lg" className="h-12 sm:h-14 px-8 text-base sm:text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Zap className="w-5 h-5 me-2" />
                {t("سجّل مجاناً الآن", "Sign Up Free")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
