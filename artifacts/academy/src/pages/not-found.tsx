import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <Card className="w-full max-w-md border border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, -5, 5, 0], y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🏴‍☠️
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {t("404 - الصفحة غير موجودة", "404 - Page Not Found")}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "عفواً! هذه الصفحة ضاعت في عالم الكود السحري. رجّع للمسار الصحيح!",
                  "Oops! This page got lost in the magical code world. Get back on track!"
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="default" className="w-full sm:w-auto gap-2">
                  <Home className="w-4 h-4" />
                  {t("الصفحة الرئيسية", "Home")}
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t("المسارات", "Tracks")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
