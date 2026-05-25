import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FantasyRankBadge, RankProgressBar } from "@/components/FantasyRankBadge";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { LevelUpModal } from "@/components/LevelUpModal";
import { useSound } from "@/contexts/SoundContext";
import { getRank, xpForLevel, xpProgressPercent, DAILY_QUESTS } from "@/lib/fantasyRanks";
import { Flame, BookOpen, Trophy, Zap, Target, Scroll, Sparkles, Crown } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useGetDashboard();
  const { playSound } = useSound();
  const [confetti, setConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  if (isLoading || !dashboard) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-card rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const rank = getRank(user?.level || 1);
  const nextLevelProgress = xpProgressPercent(user?.xp || 0, user?.level || 1);
  const questsProgress = dashboard?.languageStats?.reduce((sum, s) => sum + s.completedLessons, 0) || 0;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <ConfettiEffect trigger={confetti} />
      {showLevelUp && (
        <LevelUpModal newLevel={(user?.level || 1)} onClose={() => setShowLevelUp(false)} />
      )}

      {/* Hero Welcome */}
      <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FantasyRankBadge level={user?.level || 1} xp={user?.xp || 0} size="lg" />
          </motion.div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {t(rank.nameAr, rank.nameEn)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {t(`مرحباً بعودتك، يا `, `Welcome back, `)}
              <span className="text-primary">{user?.username}</span>
              <span className="text-xl ml-2">{rank.emoji}</span>
            </h1>
            <p className="text-sm text-muted-foreground">{rank.descriptionAr}</p>
            <RankProgressBar level={user?.level || 1} xp={user?.xp || 0} />
          </div>
          <motion.div
            className="hidden sm:flex flex-col items-center gap-1"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => playSound('click')}
          >
            <div className="text-4xl font-bold text-primary">{user?.streak || 0}</div>
            <div className="flex items-center gap-1 text-xs text-orange-500">
              <Flame className="w-3 h-3" />
              {t('يوم متتالي', 'Day Streak')}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quests (Daily Challenges) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Scroll className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold">{t('المهمات اليومية', 'Daily Quests')}</h2>
          <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent font-bold">متاح</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DAILY_QUESTS.map((quest, i) => {
            const progress = Math.min(1, quest.id === 'complete_lesson' ? (questsProgress > 0 ? 1 : 0) : 0.5);
            const isDone = progress >= 1;
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => playSound('click')}
                className={`relative p-4 rounded-xl border ${isDone ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 bg-card'} cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{quest.icon}</span>
                  {isDone && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Crown className="w-4 h-4 text-green-500" /></motion.div>}
                </div>
                <h3 className="font-bold text-sm mb-1">{t(quest.titleAr, quest.titleEn)}</h3>
                <p className="text-[11px] text-muted-foreground mb-2">{t(quest.descriptionAr, quest.descriptionEn)}</p>
                <div className="flex items-center justify-between">
                  <div className="h-1.5 flex-1 bg-muted rounded-full mr-2 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isDone ? 'bg-green-500' : 'bg-primary'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isDone ? 'text-green-500' : 'text-accent'}`}>+{quest.xpReward} XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { labelAr: 'الخبرة الكلية', labelEn: 'Total Mana', value: user?.xp || 0, icon: Zap, color: 'text-accent', border: 'border-accent/20' },
          { labelAr: 'نار الاستمرار', labelEn: 'Fire Streak', value: user?.streak || 0, icon: Flame, color: 'text-orange-500', border: 'border-orange-500/20' },
          { labelAr: 'دروس مكتملة', labelEn: 'Completed', value: dashboard.completedLessons, icon: BookOpen, color: 'text-blue-500', border: 'border-blue-500/20' },
          { labelAr: 'الرتبة الحالية', labelEn: 'Rank', value: user?.level || 1, icon: Target, color: 'text-purple-500', border: 'border-purple-500/20', isRank: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`bg-card/50 ${stat.border}`}>
              <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center space-y-2">
                <stat.icon className={`w-7 h-7 ${stat.color} mb-1`} />
                <div className="text-2xl sm:text-3xl font-bold">
                  {stat.isRank ? (
                    <span className="flex items-center gap-1">
                      {stat.value} <span className="text-lg">{getRank(Number(stat.value)).emoji}</span>
                    </span>
                  ) : stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{t(stat.labelAr, stat.labelEn)}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t('نقاط الخبرة هذا الأسبوع', 'Weekly Mana')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {dashboard.weeklyXp && dashboard.weeklyXp.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.weeklyXp}>
                      <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--accent))' }}
                        cursor={{fill: 'hsl(var(--muted))'}}
                      />
                      <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    {t('لا توجد بيانات متاحة', 'No data available')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold">{t('تقدمك في المسارات', 'Your Track Progress')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {dashboard.languageStats?.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card border-border overflow-hidden hover:border-primary/30 transition-colors">
                  <div className="h-2 w-full" style={{ backgroundColor: stat.color || '#7C3AED' }} />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-lg">{getRank(Math.max(1, Math.floor(stat.xpEarned / 100))).emoji}</span>
                      {t(stat.titleAr, stat.titleEn)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{stat.completedLessons} / {stat.totalLessons} {t('درس', 'Lessons')}</span>
                      <span className="font-bold text-accent">{stat.xpEarned} Mana</span>
                    </div>
                    <Progress value={(stat.completedLessons / (stat.totalLessons || 1)) * 100} className="h-2" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {(!dashboard.languageStats || dashboard.languageStats.length === 0) && (
              <div className="col-span-2 text-center p-8 border rounded-xl bg-card/30 text-muted-foreground">
                {t('لم تبدأ في أي مسار بعد. استكشف الدورات الآن!', 'You haven\'t started any tracks yet. Explore courses now!')}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="h-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent" />
                {t('النشاط الأخير', 'Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recentActivity?.map((activity, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      {activity.type === 'lesson' ? <BookOpen className="w-4 h-4 text-primary" /> : <Trophy className="w-4 h-4 text-accent" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t(activity.titleAr, activity.titleEn)}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        <span className="text-accent font-bold">+{activity.xpEarned} Mana</span>
                        <span>•</span>
                        <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(!dashboard.recentActivity || dashboard.recentActivity.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('لا توجد نشاطات حديثة', 'No recent activity')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Preview */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                {t('إنجازاتك', 'Your Achievements')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user && user.xp > 0 ? [
                  { icon: "🏆", labelAr: "بدء الرحلة", labelEn: "Journey Started" },
                  { icon: "🔥", labelAr: "النار الأولي", labelEn: "First Fire" },
                  { icon: "⭐", labelAr: "متعلم نشط", labelEn: "Active Learner" },
                ].map((ach, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/5 border border-primary/10 text-xs"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>{ach.icon}</span>
                    <span className="font-medium">{t(ach.labelAr, ach.labelEn)}</span>
                  </motion.div>
                )) : (
                  <p className="text-xs text-muted-foreground text-center w-full py-2">
                    {t('اكمل درسًا لتفوق الإنجازات!', 'Complete a lesson to unlock achievements!')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
