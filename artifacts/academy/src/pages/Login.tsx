import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { t } = useLanguage();
  const { setUser } = useAuth();
  const [, setLocation] = useLocation();
  const login = useLogin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          setUser(data.user);
          setLocation("/dashboard");
        },
        onError: (err: any) => {
          toast.error(err.error || t("فشل تسجيل الدخول", "Login failed"));
        }
      }
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">{t("تسجيل الدخول", "Login")}</CardTitle>
          <CardDescription>
            {t("أهلاً بك مجدداً في أكاديمية سمارت فينوم K", "Welcome back to Smart Venom K Academy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("البريد الإلكتروني", "Email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-left"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("كلمة المرور", "Password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-left"
                dir="ltr"
              />
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("تسجيل الدخول", "Login")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {t("ليس لديك حساب؟", "Don't have an account?")}
          <Link href="/register" className="text-primary hover:underline mx-1">
            {t("سجل الآن", "Register now")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
