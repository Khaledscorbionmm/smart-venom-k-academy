import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetLesson, useExecuteCode, useSubmitQuiz, useCompleteLesson, getGetLessonQueryKey } from "@workspace/api-client-react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Play, CheckCircle2, Code2, PlayCircle, Trophy, BrainCircuit, BookOpen } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useQueryClient } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function LessonViewer() {
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

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
          toast.success(t(`لقد حصلت على ${res.score}/${res.totalQuestions}`, `You scored ${res.score}/${res.totalQuestions}`));
          // Auto complete if score is 100%
          if (res.score === res.totalQuestions && !lesson.isCompleted) {
            handleCompleteLesson();
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
          toast.success(`+${res.xpEarned} XP!`);
          queryClient.invalidateQueries({ queryKey: getGetLessonQueryKey(lessonId) });
        }
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col container mx-auto max-w-6xl p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => setLocation(`/courses/${lesson.courseSlug}`)}>
          {lang === 'ar' ? <ArrowRight className="ml-2 w-4 h-4" /> : <ArrowLeft className="mr-2 w-4 h-4" />}
          {t('العودة للمسار', 'Back to Course')}
        </Button>
        <div className="flex items-center gap-4">
          <span className="flex items-center font-bold text-accent">
            <Trophy className="w-5 h-5 mr-1 rtl:ml-1 rtl:mr-0" />
            {lesson.xpReward} XP
          </span>
          {lesson.isCompleted && (
            <span className="flex items-center text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
              {t('مكتمل', 'Completed')}
            </span>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">{t(lesson.titleAr, lesson.titleEn)}</h1>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="mb-8 p-1 bg-card border border-border w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger value="content" className="px-6 py-2">
            <BookOpen className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('المحتوى', 'Content')}
          </TabsTrigger>
          {lesson.quizQuestions && lesson.quizQuestions.length > 0 && (
            <TabsTrigger value="quiz" className="px-6 py-2">
              <BrainCircuit className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('الاختبار', 'Quiz')}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="space-y-8 mt-0 outline-none">
          {/* Main Content Area */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Text & Video */}
            <div className="space-y-6">
              {(lang === 'ar' ? lesson.videoUrlAr : lesson.videoUrlEn) && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative group border border-border">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-all cursor-pointer">
                    <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                </div>
              )}
              
              <div 
                className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: t(lesson.contentAr, lesson.contentEn) }}
              />
            </div>

            {/* Right: Code Editor */}
            {lesson.codeExample && (
              <div className="space-y-4">
                <Card className="border-border/50 overflow-hidden shadow-xl bg-[#1e1e1e]">
                  <CardHeader className="p-3 bg-[#2d2d2d] flex flex-row items-center justify-between border-b border-[#404040]">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Code2 className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">{lesson.language}</span>
                    </div>
                    <Button size="sm" onClick={handleRunCode} disabled={executeCode.isPending} className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs px-4">
                      {executeCode.isPending ? t('جاري...', 'Running...') : <><Play className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t('تشغيل الكود', 'Run Code')}</>}
                    </Button>
                  </CardHeader>
                  <div className="h-[400px]">
                    <Editor
                      height="100%"
                      defaultLanguage={lesson.language?.toLowerCase()}
                      theme="vs-dark"
                      value={code}
                      onChange={(val: string | undefined) => setCode(val || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 15,
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
                      <span className="text-xs text-zinc-400 font-mono">{t('المخرجات', 'Terminal Output')}</span>
                    </CardHeader>
                    <CardContent className="p-4">
                      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
          
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
      
      {/* Fallback import for icons */}
      <div className="hidden"><BookOpen /></div>
    </div>
  );
}
