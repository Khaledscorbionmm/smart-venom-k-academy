import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Code, BookOpen } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useGetDashboard();

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

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t('مرحباً بعودتك، ', 'Welcome back, ')}
          <span className="text-primary">{user?.username}</span>
        </h1>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <Trophy className="w-8 h-8 text-accent mb-2" />
            <div className="text-3xl font-bold">{user?.xp || 0}</div>
            <div className="text-sm text-muted-foreground font-medium">{t('إجمالي الخبرة', 'Total XP')}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-orange-500/20">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <Flame className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-3xl font-bold">{user?.streak || 0}</div>
            <div className="text-sm text-muted-foreground font-medium">{t('أيام متتالية', 'Day Streak')}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-blue-500/20">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-3xl font-bold">{dashboard.completedLessons}</div>
            <div className="text-sm text-muted-foreground font-medium">{t('دروس مكتملة', 'Completed Lessons')}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-purple-500/20">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <Code className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-3xl font-bold">{user?.level || 1}</div>
            <div className="text-sm text-muted-foreground font-medium">{t('المستوى الحالي', 'Current Level')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>{t('نقاط الخبرة هذا الأسبوع', 'Weekly XP')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {dashboard.weeklyXp && dashboard.weeklyXp.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.weeklyXp}>
                      <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
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

          <h2 className="text-2xl font-bold">{t('تقدمك في اللغات', 'Your Language Progress')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {dashboard.languageStats?.map((stat, i) => (
              <Card key={i} className="bg-card border-border overflow-hidden">
                <div className="h-2 w-full" style={{ backgroundColor: stat.color || '#7C3AED' }} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t(stat.titleAr, stat.titleEn)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{stat.completedLessons} / {stat.totalLessons} {t('درس', 'Lessons')}</span>
                    <span className="font-bold text-accent">{stat.xpEarned} XP</span>
                  </div>
                  <Progress value={(stat.completedLessons / (stat.totalLessons || 1)) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
            {(!dashboard.languageStats || dashboard.languageStats.length === 0) && (
              <div className="col-span-2 text-center p-8 border rounded-xl bg-card/30 text-muted-foreground">
                {t('لم تبدأ في أي مسار بعد. استكشف الدورات الآن!', 'You haven\'t started any tracks yet. Explore courses now!')}
              </div>
            )}
          </div>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('النشاط الأخير', 'Recent Activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recentActivity?.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      {activity.type === 'lesson' ? <BookOpen className="w-4 h-4 text-primary" /> : <Trophy className="w-4 h-4 text-accent" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t(activity.titleAr, activity.titleEn)}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        <span className="text-accent font-bold">+{activity.xpEarned} XP</span>
                        <span>•</span>
                        <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!dashboard.recentActivity || dashboard.recentActivity.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('لا توجد نشاطات حديثة', 'No recent activity')}
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
