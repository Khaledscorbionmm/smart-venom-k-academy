import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (ar: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: (ar, en) => ar,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('languagePreference');
    return (saved === 'en' ? 'en' : 'ar') as Language;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('languagePreference', newLang);
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
