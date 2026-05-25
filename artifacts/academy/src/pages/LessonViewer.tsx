import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetLesson, useExecuteCode, useSubmitQuiz, useCompleteLesson, getGetLessonQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Play, CheckCircle2, Code2, BrainCircuit, BookOpen, Sparkles, Target, Baby, GraduationCap, Zap, Flame, Trophy } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useQueryClient } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useSound } from "@/contexts/SoundContext";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { LevelUpModal } from "@/components/LevelUpModal";
import { FantasyRankBadge } from "@/components/FantasyRankBadge";
import { getRank } from "@/lib/fantasyRanks";

export default function LessonViewer() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { playSound, playNarration } = useSound();
  const [confetti, setConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const { data: lesson, isLoading } = useGetLesson(lessonId);
  const executeCode = useExecuteCode();
  const submitQuiz = useSubmitQuiz();
  const completeLesson = useCompleteLesson();

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');

  // Initialize code when lesson loads
  if (lesson && !code && lesson.codeExample) {
    setCode(lesson.codeExample);
  }

  useEffect(() => {
    playNarration("welcome_ar");
  }, []);

  if (isLoading || !lesson) {
    return <div className="p-8 text-center">{t('جاري التحميل...', 'Loading...')}</div>;
  }

  const handleRunCode = () => {
    executeCode.mutate(
      { id: lessonId, data: { code, language: lesson.language || 'python' } },
      {
        onSuccess: (res) => {
          setOutput(res.output || res.error || t('تم التشغيل بنجاح، لا يوجد مخرجات', 'Executed successfully, no output'));
        },
        onError: () => {
          toast.error(t('حدث خطأ أثناء تشغيل الكود', 'Error executing code'));
        }
      }
    );
  };

  const handleQuizSubmit = () => {
    if (!lesson.quizQuestions) return;
    playSound('click');
    
    const answers = Object.entries(selectedAnswers).map(([qId, optionId]) => ({
      questionId: parseInt(qId, 10),
      selectedOptionId: optionId
    }));

    if (answers.length < lesson.quizQuestions.length) {
      toast.error(t('يرجى الإجابة على جميع الأسئلة', 'Please answer all questions'));
      return;
    }

    submitQuiz.mutate(
      { lessonId, data: { answers } },
      {
        onSuccess: (res) => {
          setQuizResults(res);
          if (res.score === res.totalQuestions) {
            playSound('success');
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3000);
            toast.success(t(`مبارك! ${res.score}/${res.totalQuestions} — درجة كاملة!`, `Amazing! ${res.score}/${res.totalQuestions} — Perfect Score!`));
            // Auto complete if score is 100%
            if (!lesson.isCompleted) {
              handleCompleteLesson();
            }
          } else {
            toast(t(`لقد حصلت على ${res.score}/${res.totalQuestions}`, `You scored ${res.score}/${res.totalQuestions}`));
          }
        }
      }
    );
  };

  const handleCompleteLesson = () => {
    completeLesson.mutate(
      { id: lessonId },
      {
        onSuccess: (res) => {
          playSound('complete');
          playNarration('lesson_done_ar');
          toast.success(t(`تم الإكمال! +${res.xpEarned} Mana!`, `Completed! +${res.xpEarned} Mana!`));
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3000);
          // Check if level up
          if (user && res.newLevel && res.newLevel > (user.level || 1)) {
            setTimeout(() => setShowLevelUp(true), 1500);
          }
          queryClient.invalidateQueries({ queryKey: getGetLessonQueryKey(lessonId) });
        }
      }
    );
  };

  // Practice prompt template (per-language)
  const practicePrompts: Record<string, { ar: string; en: string; starter: string }> = {
    python:     { ar: "غيّر الكود لطباعة اسمك بدل القيمة الموجودة، وجرّب إضافة سطر جديد بنفسك.", en: "Modify the code to print your name and try adding a new line yourself.", starter: "# جرّب بنفسك\nname = 'اسمك هنا'\nprint(name)" },
    javascript: { ar: "غيّر الكود لطباعة اسمك في الـ console، وجرّب إضافة متغير جديد.", en: "Change the code to print your name in console and add a new variable.", starter: "// جرّب بنفسك\nconst name = 'اسمك هنا';\nconsole.log(name);" },
    typescript: { ar: "أنشئ متغير جديد بنوع محدد واطبع قيمته.", en: "Create a typed variable and print its value.", starter: "// جرّب بنفسك\nconst name: string = 'اسمك هنا';\nconsole.log(name);" },
    java:       { ar: "عدّل الكود لطباعة اسمك ورسالة ترحيب.", en: "Modify to print your name and a welcome message.", starter: "public class App {\n  public static void main(String[] a) {\n    System.out.println(\"اسمك هنا\");\n  }\n}" },
    cpp:        { ar: "عدّل الكود لطباعة اسمك.", en: "Modify to print your name.", starter: "#include <iostream>\nint main() {\n  std::cout << \"اسمك هنا\";\n  return 0;\n}" },
    rust:       { ar: "اطبع اسمك ورقم عمرك.", en: "Print your name and age.", starter: "fn main() {\n  let name = \"اسمك هنا\";\n  println!(\"{}\", name);\n}" },
    go:         { ar: "عدّل الكود ليطبع اسمك.", en: "Modify to print your name.", starter: "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"اسمك هنا\")\n}" },
  };
  const practice = lesson.language ? practicePrompts[lesson.language] : null;

  // Audience level cards
  const audienceTips = [
    { icon: Baby,           color: "text-pink-400",   bg: "bg-pink-500/10",   ar: "للأطفال والمبتدئين",      en: "Kids & Beginners",   descAr: "اقرأ ببطء، اسمع التسجيل الصوتي، وكرّر المثال أكثر من مرة.",                           descEn: "Read slowly, play the audio, and repeat the example multiple times." },
    { icon: GraduationCap,  color: "text-blue-400",   bg: "bg-blue-500/10",   ar: "للشباب والطلاب",          en: "Youth & Students",   descAr: "حاول كتابة كود مشابه، وحلّ الاختبار قبل ما تشوف الإجابات.",                              descEn: "Write similar code and solve the quiz before peeking at answers." },
    { icon: Target,         color: "text-purple-400", bg: "bg-purple-500/10", ar: "للمحترفين وكبار السن",     en: "Pros & Seniors",     descAr: "ركّز على الـ best practices، عدّل الكود وجرّب سيناريوهات حقيقية.",                       descEn: "Focus on best practices, modify the code, and test real scenarios." },
  ];

  return (
    <div className="flex-1 flex flex-col container mx-auto max-w-6xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <Button variant="ghost" size="sm" onClick={() => setLocation(`/courses/${lesson.courseSlug}`)} className="shrink-0">
          {lang === 'ar' ? <ArrowRight className="ms-2 w-4 h-4" /> : <ArrowLeft className="me-2 w-4 h-4" />}
          <span className="hidden sm:inline">{t('العودة للمسار', 'Back to Course')}</span>
          <span className="sm:hidden">{t('رجوع', 'Back')}</span>
        </Button>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
          <span className="flex items-center font-bold text-accent text-sm sm:text-base">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 me-1" />
            {lesson.xpReward} XP
          </span>
          {lesson.isCompleted && (
            <span className="flex items-center text-green-500 bg-green-500/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-1" />
              {t('مكتمل', 'Completed')}
            </span>
          )}
        </div>
      </div>

      {/* Bilingual title */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold leading-tight" dir="rtl">{lesson.titleAr}</h1>
        <h2 className="text-lg sm:text-2xl font-semibold text-muted-foreground mt-1" dir="ltr">{lesson.titleEn}</h2>
      </div>

      {/* Audio player */}
      <div className="mb-6">
        <AudioPlayer
          textAr={`${lesson.titleAr}. ${lesson.contentAr}`}
          textEn={`${lesson.titleEn}. ${lesson.contentEn}`}
        />
      </div>

      {/* Audience level tips */}
      <div className="grid sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
        {audienceTips.map((tip, i) => (
          <div key={i} className={`p-3 rounded-xl border border-border/40 ${tip.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <tip.icon className={`w-4 h-4 ${tip.color}`} />
              <span className="font-bold text-xs sm:text-sm">{t(tip.ar, tip.en)}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{t(tip.descAr, tip.descEn)}</p>
          </div>
        ))}
      </div>

      <ConfettiEffect trigger={confetti} />
      {showLevelUp && (
        <LevelUpModal newLevel={user ? (user.level || 1) + 1 : 1} onClose={() => setShowLevelUp(false)} />
      )}

      {/* Fantasy Hero Bar */}
      <motion.div
        className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent border border-primary/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FantasyRankBadge level={user?.level || 1} xp={user?.xp || 0} size="sm" />
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {lesson.titleAr}
            <span className="text-muted-foreground text-sm font-normal">/ {lesson.titleEn}</span>
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-accent font-bold">
              <Zap className="w-3 h-3" />
              {lesson.xpReward} Mana
            </span>
            {lesson.language && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {lesson.language.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="mb-6 p-1 bg-card border border-border w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger value="content" className="px-3 sm:px-6 py-2 text-xs sm:text-sm">
            <BookOpen className="w-4 h-4 me-1.5 sm:me-2" />
            {t('المحتوى', 'Content')}
          </TabsTrigger>
          {lesson.quizQuestions && lesson.quizQuestions.length > 0 && (
            <TabsTrigger value="quiz" className="px-3 sm:px-6 py-2 text-xs sm:text-sm">
              <BrainCircuit className="w-4 h-4 me-1.5 sm:me-2" />
              {t('الاختبار', 'Quiz')}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="space-y-6 sm:space-y-8 mt-0 outline-none">
          {/* Bilingual content: Arabic + English side-by-side on desktop, stacked on mobile */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold">عربي</span>
                <CardTitle className="text-base">الشرح بالعربية</CardTitle>
              </CardHeader>
              <CardContent>
                <div dir="rtl" className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {lesson.contentAr}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">EN</span>
                <CardTitle className="text-base">English Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <div dir="ltr" className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-foreground/90 text-left">
                  {lesson.contentEn}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor — full width */}
          {lesson.codeExample && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Code2 className="w-4 h-4 text-primary" />
                {t('المثال العملي', 'Code Example')}
              </div>
              <Card className="border-border/50 overflow-hidden shadow-xl bg-[#1e1e1e]">
                <CardHeader className="p-3 bg-[#2d2d2d] flex flex-row items-center justify-between border-b border-[#404040]">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Code2 className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">{lesson.language}</span>
                  </div>
                  <Button size="sm" onClick={handleRunCode} disabled={executeCode.isPending} className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs px-4">
                    {executeCode.isPending ? t('جاري...', 'Running...') : <><Play className="w-3 h-3 me-1" /> {t('تشغيل', 'Run')}</>}
                  </Button>
                </CardHeader>
                <div className="h-[300px] sm:h-[400px]">
                  <Editor
                    height="100%"
                    defaultLanguage={lesson.language?.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={(val: string | undefined) => setCode(val || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                      lineHeight: 1.6,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
              </Card>

              {output && (
                <Card className="bg-black border-border/50 overflow-hidden">
                  <CardHeader className="p-2 px-4 bg-zinc-900/50 border-b border-zinc-800">
                    <span className="text-xs text-zinc-400 font-mono">{t('المخرجات', 'Output')}</span>
                  </CardHeader>
                  <CardContent className="p-4">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Practice section */}
          {practice && (
            <Card className="border-2 border-dashed border-accent/40 bg-accent/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">{t('تطبيق عملي', 'Hands-On Practice')}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5" dir="rtl">{practice.ar}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5" dir="ltr">{practice.en}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setCode(practice.starter)} variant="outline" size="sm" className="gap-2 border-accent/40">
                  <Sparkles className="w-4 h-4" />
                  {t('حمّل قالب التمرين', 'Load Exercise Template')}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end border-t border-border/50 pt-6">
            {lesson.quizQuestions && lesson.quizQuestions.length > 0 ? (
              <Button size="lg" onClick={() => setActiveTab('quiz')}>
                {t('التالي: الاختبار', 'Next: Quiz')} <ArrowRight className="ml-2 rtl:hidden w-4 h-4" /><ArrowLeft className="mr-2 ltr:hidden w-4 h-4" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleCompleteLesson} disabled={lesson.isCompleted || completeLesson.isPending}>
                {lesson.isCompleted ? t('مكتمل', 'Completed') : t('إكمال الدرس', 'Complete Lesson')}
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-8 mt-0 outline-none">
          <div className="max-w-3xl mx-auto space-y-8">
            {lesson.quizQuestions?.map((q, idx) => {
              const result = quizResults?.results?.find((r: any) => r.questionId === q.id);
              
              return (
                <Card key={q.id} className={`border-2 ${result ? (result.isCorrect ? 'border-green-500/50' : 'border-red-500/50') : 'border-border'}`}>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {idx + 1}. {t(q.questionAr, q.questionEn)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={selectedAnswers[q.id] || ""} 
                      onValueChange={(val) => setSelectedAnswers(prev => ({...prev, [q.id]: val}))}
                      disabled={!!quizResults}
                    >
                      {q.options.map((opt) => {
                        const isCorrectOpt = result?.correctOptionId === opt.id;
                        const isSelectedOpt = selectedAnswers[q.id] === opt.id;
                        let optClass = "flex items-center space-x-2 space-x-reverse border border-border p-4 rounded-xl transition-all cursor-pointer hover:bg-muted";
                        
                        if (quizResults) {
                          if (isCorrectOpt) optClass = "flex items-center space-x-2 space-x-reverse border-2 border-green-500 bg-green-500/10 p-4 rounded-xl";
                          else if (isSelectedOpt && !isCorrectOpt) optClass = "flex items-center space-x-2 space-x-reverse border-2 border-red-500 bg-red-500/10 p-4 rounded-xl";
                        } else if (isSelectedOpt) {
                          optClass = "flex items-center space-x-2 space-x-reverse border-primary bg-primary/5 p-4 rounded-xl";
                        }

                        return (
                          <div key={opt.id} className={optClass}>
                            <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} />
                            <Label htmlFor={`opt-${opt.id}`} className="flex-1 cursor-pointer font-medium text-base">
                              {t(opt.textAr, opt.textEn)}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                    
                    {result && (
                      <div className={`mt-4 p-4 rounded-lg ${result.isCorrect ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                        {result.isCorrect 
                          ? t('إجابة صحيحة! أحسنت.', 'Correct answer! Good job.')
                          : t('إجابة خاطئة. حاول مرة أخرى.', 'Wrong answer. Try again.')
                        }
                        {(result.explanationAr || result.explanationEn) && (
                          <p className="mt-2 text-sm text-muted-foreground">{t(result.explanationAr || '', result.explanationEn || '')}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex justify-center pt-8">
              {!quizResults ? (
                <Button size="lg" onClick={handleQuizSubmit} disabled={submitQuiz.isPending} className="w-full md:w-auto px-12 h-14 text-lg">
                  {submitQuiz.isPending ? t('جاري الإرسال...', 'Submitting...') : t('تسليم الإجابات', 'Submit Answers')}
                </Button>
              ) : (
                <div className="flex gap-4 w-full md:w-auto">
                  <Button size="lg" variant="outline" onClick={() => { setQuizResults(null); setSelectedAnswers({}); }} className="flex-1">
                    {t('إعادة المحاولة', 'Try Again')}
                  </Button>
                  <Button size="lg" onClick={handleCompleteLesson} disabled={lesson.isCompleted || completeLesson.isPending} className="flex-1">
                    {t('إكمال الدرس والعودة', 'Complete & Return')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
    </div>
  );
}
