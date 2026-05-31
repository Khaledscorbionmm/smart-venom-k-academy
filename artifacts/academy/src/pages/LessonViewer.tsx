import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { PageSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SimpleCodeEditor from "@/components/SimpleCodeEditor";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LessonViewer() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const { data: lesson, isLoading: lessonLoading, error: lessonError } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const response = await apiClient.get(`/lessons/${id}`);
      return response.data;
    },
  });

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const response = await apiClient.get(`/quizzes/${id}`);
      return response.data;
    },
  });

  const handleCodeRun = async (code: string) => {
    try {
      const response = await apiClient.post("/execute", {
        code,
        language: lesson?.language || "python",
      });
      return response.data.output || "تم التنفيذ بنجاح";
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "خطأ في تنفيذ الكود");
    }
  };

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId,
    });
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await apiClient.post(`/quizzes/${id}/submit`, {
        answers: selectedAnswers,
      });
      setQuizScore(response.data.score);
      setShowResults(true);
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

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions?.length || 0) - 1;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {language === "ar" ? lesson.title_ar : lesson.title_en}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed">
              {language === "ar" ? lesson.content_ar : lesson.content_en}
            </p>
          </div>

          {/* Code Example */}
          {lesson.code_example && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {language === "ar" ? "المثال العملي" : "Code Example"}
              </h3>
              <SimpleCodeEditor
                defaultCode={lesson.code_example}
                language={lesson.language || "python"}
                onRun={handleCodeRun}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Section */}
      {quiz && quiz.questions && quiz.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "اختبار الدرس" : "Lesson Quiz"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showResults ? (
              <>
                {/* Question */}
                {currentQuestion && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {language === "ar"
                        ? currentQuestion.question_ar
                        : currentQuestion.question_en}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option: any) => (
                        <label
                          key={option.id}
                          className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option.id}
                            checked={selectedAnswers[currentQuestion.id] === option.id}
                            onChange={() =>
                              handleAnswerSelect(currentQuestion.id, option.id)
                            }
                            className="w-4 h-4"
                          />
                          <span className="ml-3">
                            {language === "ar" ? option.text_ar : option.text_en}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
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
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {language === "ar" ? "إرسال الاختبار" : "Submit Quiz"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    >
                      {language === "ar" ? "التالي" : "Next"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Alert className="bg-green-500/10 border-green-500/20">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-400">
                    {language === "ar"
                      ? `تم إرسال الاختبار! النتيجة: ${quizScore}%`
                      : `Quiz submitted! Score: ${quizScore}%`}
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setQuizScore(null);
                  }}
                  className="w-full"
                >
                  {language === "ar" ? "إعادة المحاولة" : "Try Again"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
