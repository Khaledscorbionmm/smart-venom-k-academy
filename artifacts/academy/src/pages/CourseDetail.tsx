import { useLanguage } from "@/contexts/LanguageContext";
import { useGetCourse, useRequestSubscription, getGetCourseQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, CheckCircle2, Lock, PlayCircle, Code, Star, Globe, AlertCircle, RefreshCw } from "lucide-react";
import { SiPython, SiJavascript, SiTypescript, SiCplusplus, SiRust, SiGo } from "react-icons/si";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { LessonSkeleton } from "@/components/LoadingSkeleton";
import { useState, useEffect } from "react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  python: SiPython,
  javascript: SiJavascript,
  typescript: SiTypescript,
  cpp: SiCplusplus,
  rust: SiRust,
  go: SiGo,
};

export default function CourseDetail() {
  const { t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const [retryCount, setRetryCount] = useState(0);
  const [showError, setShowError] = useState(false);
  
  const { data: course, isLoading, error, refetch, isFetching } = useGetCourse(slug || "", {
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  });
  
  const requestSub = useRequestSubscription();

  // Handle loading with timeout
  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowError(true);
      }
      setShowSkeleton(false);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (showSkeleton && isLoading) return <LessonSkeleton />;
  
  if (showError && isLoading) {
    return (
      <div className="container mx-auto p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('مشكلة في التحميل', 'Loading Issue')}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {t('استغرق التحميل وقتاً طويلاً. يرجى المحاولة مرة أخرى.', 'Loading took too long. Please try again.')}
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => {
              setShowError(false);
              setShowSkeleton(true);
              refetch();
            }}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {t('إعادة المحاولة', 'Retry')}
          </Button>
          <Link href="/courses">
            <Button variant="outline">{t('عودة للمسارات', 'Back to Tracks')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('حدث خطأ', 'An Error Occurred')}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {t('لم نتمكن من تحميل تفاصيل المسار. يرجى المحاولة مرة أخرى.', 'We couldn\'t load the course details. Please try again.')}
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => {
              setShowSkeleton(true);
              refetch();
            }}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {t('إعادة المحاولة', 'Retry')}
          </Button>
          <Link href="/courses">
            <Button variant="outline">{t('عودة للمسارات', 'Back to Tracks')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-xl font-bold mb-2">{t('المسار غير موجود', 'Track Not Found')}</h2>
        <p className="text-muted-foreground mb-4">{t('المسار الذي تبحث عنه غير متوفر حالياً.', 'The track you are looking for is not currently available.')}</p>
        <Link href="/courses">
          <Button variant="outline">{t('عودة للمسارات', 'Back to Tracks')}</Button>
        </Link>
      </div>
    );
  }

  const handleSubscribe = () => {
    requestSub.mutate(
      { data: { courseId: course.id } },
      {
        onSuccess: () => {
          toast.success(t("تم إرسال طلب الاشتراك بنجاح", "Subscription request sent successfully"));
          queryClient.invalidateQueries({ queryKey: getGetCourseQueryKey(course.slug) });
        },
        onError: (err: any) => {
          toast.error(err.error || t("حدث خطأ", "An error occurred"));
        }
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative py-8 sm:py-12 md:py-20 border-b border-border/50"
        style={{ background: `linear-gradient(to bottom, ${course.color}15, transparent)` }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${course.color}20`, color: course.color }}
              >
                {(() => {
                  const IconComp = ICONS[course.slug] || (course.category === 'programming' ? Code : Globe);
                  return <IconComp className="w-7 h-7 sm:w-9 sm:h-9" />;
                })()}
              </div>
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                {course.category === 'programming' ? t('برمجة', 'Programming') : t('لغات', 'Languages')}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">{t(course.titleAr, course.titleEn)}</h1>
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground">
              {t(course.descriptionAr || '', course.descriptionEn || '')}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium pt-2">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                {course.totalLessons} {t('درس', 'Lessons')}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                {course.userXpEarned || 0} XP {t('مكتسبة', 'Earned')}
              </span>
            </div>
            
            {!course.hasAccess && course.price > 0 && (
              <div className="pt-4 sm:pt-6">
                <Button size="lg" onClick={handleSubscribe} disabled={requestSub.isPending} className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-8">
                  {requestSub.isPending ? t('جاري الإرسال...', 'Sending...') : t('اشترك الآن لفتح كل الدروس', 'Subscribe to unlock all lessons')}
                </Button>
              </div>
            )}
            
            {course.hasAccess && (
              <div className="pt-4 sm:pt-6">
                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/20 text-sm px-4 py-1">
                  <CheckCircle2 className="w-4 h-4 me-2" />
                  {t('مشترك', 'Subscribed')}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-8 sm:py-12 container mx-auto px-3 sm:px-4 max-w-4xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 px-1">{t('محتوى المسار', 'Course Curriculum')}</h2>
        
        <Accordion type="multiple" className="space-y-3 sm:space-y-4" defaultValue={course.chapters.slice(0, 1).map(c => c.id.toString())}>
          {course.chapters.map((chapter, chIdx) => (
            <AccordionItem key={chapter.id} value={chapter.id.toString()} className="border border-border/50 rounded-xl bg-card overflow-hidden">
              <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3 w-full pe-2">
                  <div className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold">
                    {chIdx + 1}
                  </div>
                  <div className="flex flex-col items-start text-start min-w-0 flex-1">
                    <h3 className="font-bold text-base sm:text-lg">{t(chapter.titleAr, chapter.titleEn)}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-normal">
                      <BookOpen className="w-3 h-3" />
                      <span>{chapter.lessons.length} {t('درس', 'lessons')}</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 border-t border-border/50">
                <div className="flex flex-col">
                  {chapter.lessons.map((lesson, idx) => {
                    const isLocked = !lesson.isFree && !course.hasAccess;
                    return (
                      <div 
                        key={lesson.id} 
                        className={`flex items-center justify-between gap-3 p-3 sm:p-4 sm:px-6 border-b border-border/50 last:border-0 ${lesson.isCompleted ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className={`shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${lesson.isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {lesson.isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <span>{idx + 1}</span>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium text-sm sm:text-base truncate ${isLocked ? 'text-muted-foreground' : ''}`}>
                              {t(lesson.titleAr, lesson.titleEn)}
                            </p>
                            <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                              {lesson.hasVideo && <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {t('فيديو', 'Video')}</span>}
                              <span className="flex items-center gap-1"><Code className="w-3 h-3" /> {t('تدريب', 'Practice')}</span>
                              <span className="flex items-center gap-1 text-accent"><Star className="w-3 h-3" /> +{lesson.xpReward} XP</span>
                            </div>
                          </div>
                        </div>
                        
                        {isLocked ? (
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/50 shrink-0" />
                        ) : (
          <Link href={`/lessons/${lesson.id}`} className="shrink-0">
            <Button 
              variant={lesson.isCompleted ? "outline" : "default"} 
              size="sm" 
              className="text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => {
                // Prefetch lesson data for faster loading
                queryClient.prefetchQuery({
                  queryKey: ['lesson', lesson.id],
                  queryFn: async () => {
                    const response = await fetch(`/api/lessons/${lesson.id}`);
                    return response.json();
                  }
                });
              }}
            >
              {lesson.isCompleted ? t('مراجعة', 'Review') : t('ابدأ', 'Start')}
            </Button>
          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}