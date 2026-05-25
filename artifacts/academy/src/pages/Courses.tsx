import { useLanguage } from "@/contexts/LanguageContext";
import { useGetCourses } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Globe } from "lucide-react";
import { SiPython, SiJavascript, SiTypescript, SiCplusplus, SiRust, SiGo } from "react-icons/si";

const ICONS: Record<string, any> = {
  SiPython, SiJavascript, SiTypescript, SiCplusplus, SiRust, SiGo
};

export default function Courses() {
  const { t } = useLanguage();
  const { data: courses, isLoading } = useGetCourses();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-card rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">{t('استكشف المسارات', 'Explore Tracks')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t('اختر المسار الذي يناسبك وابدأ رحلتك في تعلم البرمجة واللغات.', 'Choose the track that fits you and start your journey in programming and languages.')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => {
          const Icon = ICONS[course.icon] || BookOpen;
          
          return (
            <Card key={course.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="h-2 w-full" style={{ backgroundColor: course.color }} />
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <Badge variant="secondary" className="mb-2">
                    {course.category === 'programming' ? (
                      <><Code className="w-3 h-3 ml-1 mr-1 rtl:mr-0 rtl:ml-1" /> {t('برمجة', 'Programming')}</>
                    ) : (
                      <><Globe className="w-3 h-3 ml-1 mr-1 rtl:mr-0 rtl:ml-1" /> {t('لغات', 'Languages')}</>
                    )}
                  </Badge>
                  <CardTitle className="text-2xl">{t(course.titleAr, course.titleEn)}</CardTitle>
                </div>
                <div 
                  className="p-3 rounded-xl bg-muted"
                  style={{ color: course.color }}
                >
                  <Icon className="w-8 h-8" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
                  {t(course.descriptionAr || '', course.descriptionEn || '')}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.totalLessons} {t('درس', 'Lessons')}
                  </span>
                  <span>•</span>
                  <span>{course.price === 0 ? t('مجاني', 'Free') : `$${course.price}`}</span>
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