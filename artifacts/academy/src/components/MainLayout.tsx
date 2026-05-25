import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Trophy, User as UserIcon, Shield } from 'lucide-react';
import { useLogout } from '@workspace/api-client-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const { user, setUser } = useAuth();
  const logout = useLogout();
  const [location] = useLocation();

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setUser(null)
    });
  };

  const isActive = (path: string) => location.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-primary tracking-tight">
              SMART VENOM K
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t('لوحة التحكم', 'Dashboard')}
                </Link>
                <Link href="/courses" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/courses') ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t('المسارات', 'Courses')}
                </Link>
                <Link href="/leaderboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/leaderboard') ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t('المتصدرين', 'Leaderboard')}
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={toggleLang} className="font-medium">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold">
                  <Trophy className="w-4 h-4" />
                  {user.xp}
                </div>
                
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Shield className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <UserIcon className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                  {t('خروج', 'Logout')}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  {t('دخول', 'Login')}
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {t('ابدأ مجاناً', 'Start Free')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Mobile bottom nav for logged in users */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-40 px-2">
          <Link href="/dashboard" className={`flex flex-col items-center p-2 ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px]">{t('الرئيسية', 'Home')}</span>
          </Link>
          <Link href="/courses" className={`flex flex-col items-center p-2 ${isActive('/courses') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Code2 className="w-5 h-5 mb-1" />
            <span className="text-[10px]">{t('المسارات', 'Courses')}</span>
          </Link>
          <Link href="/leaderboard" className={`flex flex-col items-center p-2 ${isActive('/leaderboard') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-[10px]">{t('الترتيب', 'Rank')}</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-[10px]">{t('حسابي', 'Profile')}</span>
          </Link>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/201034009418"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all z-50 ${user ? 'bottom-24 md:bottom-6' : 'bottom-6'}`}
      >
        <MessageCircle className="w-7 h-7" />
      </a>
      
      {/* Fallback imports for mobile nav */}
      <div className="hidden"><BookOpen /><Code2 /></div>
    </div>
  );
}

// Dummy imports for TS
import { BookOpen, Code as Code2 } from 'lucide-react';