import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRegister } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Sparkles, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const { t, lang, setLang } = useLanguage();
  const { setUser } = useAuth();
  const [, setLocation] = useLocation();
  const register = useRegister();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [languagePreference, setLanguagePreference] = useState<'ar' | 'en'>(lang);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("كلمتا المرور غير متطابقتين", "Passwords do not match"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "Password must be at least 6 characters"));
      return;
    }
    register.mutate(
      { data: { username, email, password, languagePreference } },
      {
        onSuccess: (data) => {
          setSuccess(true);
          toast.success(
            t("🎉 تم إنشاء حسابك بنجاح! أهلاً بك في عالم الكود!", "🎉 Account created successfully! Welcome to the Code World!"),
            { duration: 4000 }
          );
          setTimeout(() => {
            setUser(data.user);
            setLang(languagePreference);
            setLocation("/dashboard");
          }, 1500);
        },
        onError: (err: any) => {
          const msg = err?.data?.error || err?.message || t("فشل التسجيل", "Registration failed");
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
        <AnimatePresence>
          {success && (
            <motion.div
              className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
              <div>
                <p className="font-bold text-green-400">{t("تم إنشاء الحساب بنجاح! ✨", "Account created successfully! ✨")}</p>
                <p className="text-sm text-muted-foreground">{t("جاري تحويلك إلى لوحة التحكم...", "Redirecting to your dashboard...")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="border-border/50 shadow-xl shadow-black/20">
          <CardHeader className="text-center space-y-3 pb-4">
            <motion.div
              className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🧙‍♂️
            </motion.div>
            <CardTitle className="text-2xl font-bold">{t("ابدأ رحلتك السحرية", "Start Your Magic Journey")}</CardTitle>
            <CardDescription>
              {t("انضم إلى آلاف المتعلمين في أكاديمية سمارت فينوم K", "Join thousands of learners at Smart Venom K Academy")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-1.5 text-sm">
                  <User className="w-3.5 h-3.5 text-primary" />
                  {t("اسم المستخدم", "Username")}
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder={t("اختر اسماً فريداً", "Choose a unique name")}
                  className="h-11"
                />
              </div>

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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="text-left h-11 pr-10"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-1.5 text-sm">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  {t("تأكيد كلمة المرور", "Confirm Password")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`text-left h-11 pr-10 ${confirmPassword && password !== confirmPassword ? 'border-red-500/50' : confirmPassword && password === confirmPassword ? 'border-green-500/50' : ''}`}
                    dir="ltr"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-400">{t("كلمتا المرور غير متطابقتين", "Passwords do not match")}</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t("كلمتا المرور متطابقتان", "Passwords match")}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  {t("لغة المنصة المفضلة", "Preferred Platform Language")}
                </Label>
                <RadioGroup value={languagePreference} onValueChange={(val) => setLanguagePreference(val as 'ar' | 'en')} className="flex gap-3">
                  <div
                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${languagePreference === 'ar' ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/30'}`}
                    onClick={() => setLanguagePreference('ar')}
                  >
                    <RadioGroupItem value="ar" id="ar" />
                    <Label htmlFor="ar" className="cursor-pointer font-medium">🇸🇦 العربية</Label>
                  </div>
                  <div
                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${languagePreference === 'en' ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/30'}`}
                    onClick={() => setLanguagePreference('en')}
                  >
                    <RadioGroupItem value="en" id="en" />
                    <Label htmlFor="en" className="cursor-pointer font-medium">🇬🇧 English</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-bold"
                disabled={register.isPending || success}
              >
                {register.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("جاري الإنشاء...", "Creating...")}</>
                ) : success ? (
                  <><CheckCircle2 className="mr-2 h-4 w-4" /> {t("تم! جاري التحويل...", "Done! Redirecting...")}</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> {t("أنشئ حسابك الآن", "Create Your Account")}</>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center text-sm text-muted-foreground gap-1">
            {t("لديك حساب بالفعل؟", "Already have an account?")}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t("سجل الدخول", "Login")}
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
