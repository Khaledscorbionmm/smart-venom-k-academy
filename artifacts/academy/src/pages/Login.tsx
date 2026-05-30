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
import { Loader2, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { t } = useLanguage();
  const { setUser } = useAuth();
  const [, setLocation] = useLocation();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          setUser(data.user);
          toast.success(t(`أهلاً بك مجدداً، ${data.user.username}! 👋`, `Welcome back, ${data.user.username}! 👋`));
          setLocation(data.user.role === "admin" ? "/admin" : "/dashboard");
        },
        onError: (err: any) => {
          const msg = err?.data?.error || err?.message || t("فشل تسجيل الدخول", "Login failed");
          toast.error(msg);
        }
      }
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[80vh]">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-border/50 shadow-xl shadow-black/20">
          <CardHeader className="text-center space-y-3 pb-4">
            <motion.div
              className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔮
            </motion.div>
            <CardTitle className="text-2xl font-bold">{t("أهلاً بعودتك!", "Welcome Back!")}</CardTitle>
            <CardDescription>
              {t("سجّل الدخول لمتابعة رحلتك السحرية", "Login to continue your magic journey")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {t("البريد الإلكتروني", "Email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-left h-11"
                  dir="ltr"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-sm">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  {t("كلمة المرور", "Password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-left h-11 pr-10"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-bold"
                disabled={login.isPending}
              >
                {login.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("جاري الدخول...", "Signing in...")}</>
                ) : (
                  <><LogIn className="mr-2 h-4 w-4" /> {t("تسجيل الدخول", "Login")}</>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <div className="w-full border-t border-border/40" />
            <p className="text-sm text-muted-foreground text-center">
              {t("ليس لديك حساب؟", "Don't have an account?")}
              {" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                {t("سجل مجاناً الآن", "Register for free")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
