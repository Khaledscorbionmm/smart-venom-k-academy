import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <section className="py-20 md:py-32 container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-balance">
          <span className="text-primary">{t('تعلم البرمجة', 'Learn Coding')}</span> 
          <br />
          {t('بطريقة لم تعهدها من قبل', 'Like Never Before')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          {t(
            'منصة سمارت فينوم K تقدم لك أقوى المسارات التعليمية في البرمجة واللغات. انضم الآن وابدأ رحلتك نحو الاحتراف.',
            'Smart Venom K provides the most powerful learning tracks in programming and languages. Join now and start your journey.'
          )}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('ابدأ رحلتك مجاناً', 'Start Your Journey Free')}
            </Button>
          </Link>
          <Link href="/courses">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/20 hover:bg-primary/10">
              {t('استكشف الدورات', 'Explore Courses')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Placeholder for features / courses */}
      <section className="bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('لماذا أكاديمية سمارت فينوم K؟', 'Why Smart Venom K Academy?')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-4">{t('محتوى احترافي', 'Professional Content')}</h3>
              <p className="text-muted-foreground">{t('مناهج مصممة بعناية لتناسب سوق العمل.', 'Carefully crafted curriculum for the job market.')}</p>
            </div>
            <div className="bg-background rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-4">{t('تدريب عملي', 'Hands-on Practice')}</h3>
              <p className="text-muted-foreground">{t('محرر أكواد مدمج واختبارات تفاعلية.', 'Built-in code editor and interactive quizzes.')}</p>
            </div>
            <div className="bg-background rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-4">{t('دعم مستمر', 'Continuous Support')}</h3>
              <p className="text-muted-foreground">{t('متابعة وإرشاد على مدار الساعة.', 'Ongoing guidance and 24/7 support.')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
