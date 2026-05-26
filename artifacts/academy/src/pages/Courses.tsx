import { useLanguage } from "@/contexts/LanguageContext";
import { useGetCourses } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Globe } from "lucide-react";
import { SiPython, SiJavascript, SiTypescript, SiCplusplus, SiRust, SiGo } from "react-icons/si";
import { CoursesSkeleton } from "@/components/LoadingSkeleton";
import { offlineCache } from "@/lib/offlineCache";
import { useEffect } from "react";

// Map course slugs to react-icons components
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  python: SiPython,
  javascript: SiJavascript,
  typescript: SiTypescript,
  cpp: SiCplusplus,
  rust: SiRust,
  go: SiGo,
};

export default function Courses() {
  const { t } = useLanguage();
  const { data: courses, isLoading } = useGetCourses();

  // Cache courses when loaded
  useEffect(() => {
    if (courses) offlineCache.saveCourses(courses);
  }, [courses]);

  const cachedCourses = offlineCache.loadCourses();
  const displayCourses = courses || cachedCourses;

  if (isLoading && !displayCourses) {
    return <CoursesSkeleton />;
  }

  return (
    <div className="container mx-auto p-3 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-6 sm:mb-12 pt-4">
        <h1 className="text-2xl sm:text-4xl font-bold">{t('استكشف المسارات', 'Explore Tracks')}</h1>
        <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl px-2">
          {t('اختر المسار الذي يناسبك وابدأ رحلتك في تعلم البرمجة واللغات.', 'Choose the track that fits you and start your journey in programming and languages.')}
        </p>
      </div>

      {!navigator.onLine && cachedCourses && (
        <div className="text-center text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg py-2 px-4">
          {t('أنت في وضع عدم الاتصال. البيانات المعروضة من ذاكرة التخزين المحلية.', 'You are offline. Data shown from local cache.')}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayCourses?.map((course) => {
          const Icon = ICONS[course.slug] || (course.category === 'programming' ? Code : Globe);
          
          return (
            <Card key={course.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="h-1.5 sm:h-2 w-full" style={{ backgroundColor: course.color }} />
              <CardHeader className="flex flex-row items-start justify-between pb-2 gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {course.category === 'programming' ? (
                      <><Code className="w-3 h-3 me-1" /> {t('برمجة', 'Programming')}</>
                    ) : (
                      <><Globe className="w-3 h-3 me-1" /> {t('لغات', 'Languages')}</>
                    )}
                  </Badge>
                  <CardTitle className="text-lg sm:text-2xl">{t(course.titleAr, course.titleEn)}</CardTitle>
                </div>
                <div 
                  className="shrink-0 p-2 sm:p-3 rounded-xl bg-muted"
                  style={{ color: course.color }}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                  {t(course.descriptionAr || '', course.descriptionEn || '')}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {course.totalLessons} {t('درس', 'Lessons')}
                  </span>
                  <span>•</span>
                  <span>{course.price === 0 ? t('مجاني', 'Free') : `${course.price} ${t('ج.م', 'EGP')}`}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/courses/${course.slug}`} className="w-full">
                  <Button className="w-full group-hover:bg-primary" variant="secondary">
                    {t('عرض التفاصيل', 'View Details')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}