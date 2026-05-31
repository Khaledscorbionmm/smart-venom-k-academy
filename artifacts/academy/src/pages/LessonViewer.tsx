import { useParams } from "wouter";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { useState } from "react";
  import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle, Trophy } from "lucide-react";
  import { apiClient } from "@/lib/api-client";
  import { PageSkeleton } from "@/components/LoadingSkeleton";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Alert, AlertDescription } from "@/components/ui/alert";
  import SimpleCodeEditor from "@/components/SimpleCodeEditor";
  import { useLanguage } from "@/contexts/LanguageContext";
  import { useAuth } from "@/contexts/AuthContext";

  export default function LessonViewer() {
    const { id } = useParams();
    const { language } = useLanguage();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [quizResult, setQuizResult] = useState<{ score: number; percentage: number; totalQuestions: number } | null>(null);

    const { data: lesson, isLoading: lessonLoading, error: lessonError } = useQuery({
      queryKey: ["lesson", id],
      queryFn: async () => {
        const response = await apiClient.get(`/lessons/${id}`);
        return response.data;
      },
      retry: 2,
    });

    const completeMutation = useMutation({
      mutationFn: async () => {
        const response = await apiClient.post(`/lessons/${id}/complete`, {});
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lesson", id] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      },
    });

    const handleCodeRun = async (code: string): Promise<string> => {
      try {
        const response = await apiClient.post(`/lessons/${id}/execute`, {
          code,
          language: lesson?.language || "python",
        });
        if (response.data.success === false) {
          throw new Error(response.data.error || "خطأ في تنفيذ الكود");
        }
        return response.data.output || "✅ تم التنفيذ بنجاح (لا يوجد إخراج)";
      } catch (error: any) {
        const msg = error.response?.data?.error || error.message || "خطأ في تنفيذ الكود";
        throw new Error(msg);
      }
    };

    const handleAnswerSelect = (questionId: number, optionId: string) => {
      setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmitQuiz = async () => {
      if (!lesson?.quizQuestions?.length) return;
      try {
        const answersArray = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
          questionId: parseInt(questionId),
          selectedOptionId,
        }));
        const response = await apiClient.post(`/quizzes/${id}/submit`, {
          answers: answersArray,
        });
        setQuizResult({
          score: response.data.correctAnswers,
          percentage: response.data.percentage,
          totalQuestions: response.data.totalQuestions,
        });
        setShowResults(true);
        if (response.data.passed) {
          completeMutation.mutate();
        }
      } catch (error) {
        console.error("خطأ في إرسال الاختبار:", error);
      }
    };

    if (lessonLoading) {
      return <PageSkeleton />;
    }

    if (lessonError || !lesson) {
      return (
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              عذراً، حدث خطأ في تحميل الدرس. يرجى المحاولة لاحقاً.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    const quizQuestions = lesson.quizQuestions || [];
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
    const allAnswered = quizQuestions.every((q: any) => selectedAnswers[q.id] !== undefined);

    return (
      <div className="container mx-auto py-8 space-y-8 max-w-4xl">
        {/* Lesson Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-xl sm:text-2xl">
                {language === "ar" ? lesson.titleAr : lesson.titleEn}
              </CardTitle>
              {lesson.isCompleted && (
                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {language === "ar" ? "مكتمل" : "Completed"}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                {lesson.language?.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {lesson.xpReward || 50} XP
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {language === "ar" ? lesson.contentAr : lesson.contentEn}
              </p>
            </div>

            {lesson.codeExample && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  {language === "ar" ? "📝 المثال العملي" : "📝 Code Example"}
                </h3>
                <SimpleCodeEditor
                  defaultCode={lesson.codeExample}
                  language={lesson.language || "python"}
                  onRun={handleCodeRun}
                />
              </div>
            )}

            {!lesson.isCompleted && user && quizQuestions.length === 0 && (
              <Button
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {completeMutation.isPending
                  ? (language === "ar" ? "جاري التسجيل..." : "Saving...")
                  : (language === "ar" ? "إكمال الدرس (+XP)" : "Complete Lesson (+XP)")}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Quiz Section */}
        {quizQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "ar" ? "🧠 اختبار الدرس" : "🧠 Lesson Quiz"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "ar"
                  ? `السؤال ${currentQuestionIndex + 1} من ${quizQuestions.length}`
                  : `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showResults ? (
                <>
                  {currentQuestion && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold leading-relaxed">
                        {language === "ar"
                          ? currentQuestion.questionAr
                          : currentQuestion.questionEn}
                      </h3>

                      <div className="space-y-3">
                        {currentQuestion.options?.map((option: any) => {
                          const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                          return (
                            <label
                              key={option.id}
                              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-accent"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={option.id}
                                checked={isSelected}
                                onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                className="w-4 h-4"
                              />
                              <span className="ml-3 mr-3">
                                {language === "ar" ? option.textAr : option.textEn}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      {language === "ar" ? "السابق" : "Previous"}
                    </Button>

                    {isLastQuestion ? (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={!allAnswered}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {language === "ar" ? "إرسال الاختبار" : "Submit Quiz"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        disabled={!selectedAnswers[currentQuestion?.id]}
                      >
                        {language === "ar" ? "التالي" : "Next"}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Alert className={quizResult && quizResult.percentage >= 60 ? "bg-green-500/10 border-green-500/30" : "bg-yellow-500/10 border-yellow-500/30"}>
                    <AlertCircle className={`h-4 w-4 ${quizResult && quizResult.percentage >= 60 ? "text-green-500" : "text-yellow-500"}`} />
                    <AlertDescription className="text-base">
                      {language === "ar"
                        ? `النتيجة: ${quizResult?.score}/${quizResult?.totalQuestions} (${quizResult?.percentage}%) ${quizResult && quizResult.percentage >= 60 ? "✅ نجحت!" : "❌ حاول مرة أخرى"}`
                        : `Score: ${quizResult?.score}/${quizResult?.totalQuestions} (${quizResult?.percentage}%) ${quizResult && quizResult.percentage >= 60 ? "✅ Passed!" : "❌ Try Again"}`}
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers({});
                      setQuizResult(null);
                    }}
                    className="w-full"
                  >
                    {language === "ar" ? "🔄 إعادة المحاولة" : "🔄 Try Again"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  