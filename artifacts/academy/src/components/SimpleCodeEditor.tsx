import React, { useState, useEffect } from 'react';
import { Play, Copy, Check } from 'lucide-react';
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

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    
    try {
      const result = await onRun(code);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تنفيذ الكود');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-muted-foreground">
              {language.toUpperCase()}
            </div>
          </div>
          <div className="flex gap-2">
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
            />
          </div>

          {/* Output */}
          {(output || error) && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                النتيجة:
              </div>
              <div
                className={`p-4 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[200px] ${
                  error
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-[#1e1e1e] text-green-400 border border-border'
                }`}
              >
                {error || output}
              </div>
            </div>
          )}

          {isRunning && (
            <div className="flex items-center justify-center p-4">
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
