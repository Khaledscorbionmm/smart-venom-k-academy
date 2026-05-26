import { Component, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "wouter";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

function ErrorFallback({ error, onReset }: { error?: Error; onReset: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg border-destructive/30 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t("عفواً! حدث خطأ تقني", "Oops! A Technical Error Occurred")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "الموقع واجه مشكلة تقنية. جرب تحديث الصفحة أو العودة للصفحة الرئيسية.",
                "The site encountered a technical issue. Try refreshing the page or go back to the home page."
              )}
            </p>
          </div>
          {error && (
            <details className="text-left">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                {t("تفاصيل الخطأ (للمطورين)", "Error details (for developers)")}
              </summary>
              <pre className="mt-2 p-3 rounded bg-muted text-xs text-muted-foreground overflow-auto max-h-40">
                {error.message}\n{error.stack}
              </pre>
            </details>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onReset} variant="default" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {t("تحديث الصفحة", "Refresh Page")}
            </Button>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                {t("الصفحة الرئيسية", "Home")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
