import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, RotateCcw, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SimpleCodeEditorProps {
  defaultCode: string;
  language: string;
  onRun: (code: string) => Promise<string>;
  isLoading?: boolean;
}

export const SimpleCodeEditor: React.FC<SimpleCodeEditorProps> = ({
  defaultCode,
  language,
  onRun,
  isLoading = false,
}) => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runCount, setRunCount] = useState(0);

  // Reset output when code changes significantly
  useEffect(() => {
    setCode(defaultCode);
    setOutput('');
    setError(null);
  }, [defaultCode]);

  const handleRun = async () => {
    // Validate code is not empty or just whitespace
    if (!code.trim()) {
      setError('الكود فارغ! يرجى كتابة كود أولاً.');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput('');
    
    try {
      const result = await onRun(code);
      setOutput(result);
      setRunCount(prev => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير معروف أثناء تنفيذ الكود';
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('فشل نسخ الكود. يرجى المحاولة يدوياً.');
    }
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput('');
    setError(null);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">
              {language.toUpperCase()}
            </div>
            {runCount > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                مرات التشغيل: {runCount}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="gap-2"
              title="إعادة تعيين الكود"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  نسخ
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleRun}
              disabled={isRunning || isLoading}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'جاري التنفيذ...' : 'تشغيل'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Editor */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[300px] p-4 bg-[#1e1e1e] text-green-400 font-mono text-sm border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck="false"
              disabled={isLoading}
              placeholder="اكتب الكود هنا..."
              dir="ltr"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {code.length} حرف
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-red-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                الخطأ:
              </div>
              <div
                className="p-4 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[200px] bg-red-500/10 text-red-400 border border-red-500/20"
              >
                {error}
              </div>
            </div>
          )}

          {/* Output */}
          {output && !error && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                المخرج:
              </div>
              <div
                className="p-4 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[300px] bg-[#1e1e1e] text-green-400 border border-border"
              >
                {output}
              </div>
            </div>
          )}

          {isRunning && (
            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-3 text-sm text-muted-foreground">جاري التنفيذ...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleCodeEditor;
