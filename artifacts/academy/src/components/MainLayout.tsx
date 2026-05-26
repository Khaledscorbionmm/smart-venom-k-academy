import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/contexts/SoundContext';
import { FantasyRankBadge } from './FantasyRankBadge';
import { getRank } from '@/lib/fantasyRanks';
import { MessageCircle, Trophy, User as UserIcon, Shield, Flame, Zap, Sparkles } from 'lucide-react';
import { useLogout } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const { user, setUser } = useAuth();
  const { playSound } = useSound();
  const logout = useLogout();
  const [location] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
    playSound('click');
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
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight group">
              <motion.span
                className="text-2xl"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                {user ? getRank(user.level || 1).emoji : "👑"}
              </motion.span>
              <span className="group-hover:text-primary/80 transition-colors">SMART VENOM K</span>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-5">
                {[
                  { path: '/dashboard', ar: 'لوحة التحكم', en: 'Dashboard', icon: Zap },
                  { path: '/courses', ar: 'المسارات', en: 'Courses', icon: Trophy },
                  { path: '/leaderboard', ar: 'المتصدرين', en: 'Leaderboard', icon: Flame },
                ].map(item => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${isActive(item.path) ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => playSound('click')}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {t(item.ar, item.en)}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleLang} className="font-medium text-xs">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </Button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  {user.xp} Mana
                </div>
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold">
                  <Flame className="w-3 h-3" />
                  {user.streak || 0}
                </div>
                
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                      <Shield className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                    <FantasyRankBadge level={user.level || 1} xp={user.xp || 0} size="sm" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex h-8 text-xs">
                  {t('خروج', 'Logout')}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
                  {t('دخول', 'Login')}
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs" onClick={() => playSound('click')}>
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

      {/* WhatsApp FAB - positioned away from mascot on mobile */}
      <a
        href="https://wa.me/201034009418"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed w-12 h-12 sm:w-14 sm:h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all z-40 ${user ? 'bottom-24 left-4 sm:left-auto sm:right-6 sm:bottom-6' : 'left-4 sm:left-auto sm:right-6 bottom-6'}`}
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
      
      {/* Fallback imports for mobile nav */}
      <div className="hidden"><BookOpen /><Code2 /></div>
    </div>
  );
}

// Dummy imports for TS
import { BookOpen, Code as Code2 } from 'lucide-react';