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
import { Loader2 } from "lucide-react";

export default function Register() {
  const { t, lang, setLang } = useLanguage();
  const { setUser } = useAuth();
  const [, setLocation] = useLocation();
  const register = useRegister();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [languagePreference, setLanguagePreference] = useState<'ar' | 'en'>(lang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(
      { data: { username, email, password, languagePreference } },
      {
        onSuccess: (data) => {
          setUser(data.user);
          setLang(languagePreference);
          setLocation("/dashboard");
        },
        onError: (err: any) => {
          toast.error(err.error || t("فشل التسجيل", "Registration failed"));
        }
      }
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">{t("حساب جديد", "Create Account")}</CardTitle>
          <CardDescription>
            {t("ابدأ رحلتك في تعلم البرمجة", "Start your programming journey")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("اسم المستخدم", "Username")}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
              />
            </div>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="text-left"
                dir="ltr"
              />
            </div>
            <div className="space-y-3">
              <Label>{t("لغة المنصة المفضلة", "Preferred Platform Language")}</Label>
              <RadioGroup value={languagePreference} onValueChange={(val) => setLanguagePreference(val as 'ar' | 'en')} className="flex gap-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="ar" id="ar" />
                  <Label htmlFor="ar">العربية</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en">English</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("إنشاء حساب", "Register")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {t("لديك حساب بالفعل؟", "Already have an account?")}
          <Link href="/login" className="text-primary hover:underline mx-1">
            {t("سجل الدخول", "Login")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
