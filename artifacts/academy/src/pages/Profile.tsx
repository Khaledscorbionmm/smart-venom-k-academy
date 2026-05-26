import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetUserProgress, useGetUserAchievements } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Code, Medal, BookOpen, Star } from "lucide-react";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: progress, isLoading: loadingProgress } = useGetUserProgress();
  const { data: achievements, isLoading: loadingAchievements } = useGetUserAchievements();

  if (loadingProgress || loadingAchievements) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Profile Info */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="text-center bg-card border-border/50">
            <CardContent className="pt-8 pb-8 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                <AvatarImage src={user?.avatarUrl || undefined} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {user?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-1">{user?.username}</h2>
              <p className="text-muted-foreground mb-6">{user?.email}</p>
              
              <div className="flex gap-4 w-full justify-center">
                <div className="flex flex-col items-center bg-muted/50 rounded-xl p-3 px-6">
                  <Flame className="w-6 h-6 text-orange-500 mb-1" />
                  <span className="font-bold text-lg">{user?.streak}</span>
                  <span className="text-xs text-muted-foreground">{t('أيام متتالية', 'Streak')}</span>
                </div>
                <div className="flex flex-col items-center bg-muted/50 rounded-xl p-3 px-6">
                  <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
                  <span className="font-bold text-lg">{user?.level}</span>
                  <span className="text-xs text-muted-foreground">{t('المستوى', 'Level')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">{t('نظرة عامة', 'Overview')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" /> {t('إجمالي الخبرة', 'Total XP')}
                </span>
                <span className="font-bold text-accent">{progress?.totalXp || 0} XP</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> {t('الدروس المكتملة', 'Completed Lessons')}
                </span>
                <span className="font-bold">{progress?.completedLessons || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Code className="w-4 h-4" /> {t('المسارات المشترك بها', 'Enrolled Tracks')}
                </span>
                <span className="font-bold">{progress?.courseProgress?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 space-y-8">
          
          {/* Achievements */}
          <section className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Medal className="w-6 h-6 text-primary" /> 
              {t('الإنجازات', 'Achievements')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements?.map(ach => (
                <div 
                  key={ach.id} 
                  className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                    ach.isEarned 
                      ? 'bg-card border-primary/30 shadow-sm' 
                      : 'bg-muted/20 border-border/30 opacity-60 grayscale'
                  }`}
                >
                  <div className={`p-3 rounded-full ${ach.isEarned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">{t(ach.nameAr, ach.nameEn)}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t(ach.descriptionAr, ach.descriptionEn)}</p>
                </div>
              ))}
              {!achievements?.length && (
                <div className="col-span-full text-center p-8 bg-card/30 border border-border/50 rounded-xl text-muted-foreground">
                  {t('لا توجد إنجازات بعد.', 'No achievements yet.')}
                </div>
              )}
            </div>
          </section>

          {/* Course Progress */}
          <section className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" /> 
              {t('تقدم المسارات', 'Track Progress')}
            </h3>
            <div className="space-y-4">
              {progress?.courseProgress?.map(course => (
                <Card key={course.courseSlug} className="border-border/50 overflow-hidden">
                  <div className="flex p-4 gap-4 items-center">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: course.color || 'hsl(var(--primary))' }}
                    >
                      <Code className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-end mb-2">
                        <h4 className="font-bold truncate">{t(course.titleAr, course.titleEn)}</h4>
                        <span className="text-sm font-medium">{Math.round(course.percentage)}%</span>
                      </div>
                      <Progress value={course.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-2">
                        {course.completedLessons} / {course.totalLessons} {t('درس', 'Lessons')}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {!progress?.courseProgress?.length && (
                <div className="text-center p-8 bg-card/30 border border-border/50 rounded-xl text-muted-foreground">
                  {t('لم تبدأ في أي مسار بعد.', 'You haven\'t started any tracks yet.')}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}