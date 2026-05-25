import { createContext, useContext, useCallback } from 'react';

interface SoundContextType {
  playSound: (type: SoundType) => void;
  playNarration: (key: string) => void;
}

export type SoundType = 
  | 'click' | 'success' | 'levelUp' | 'xpGain' 
  | 'streakFire' | 'questUnlock' | 'complete';

const SoundContext = createContext<SoundContextType>({
  playSound: () => {},
  playNarration: () => {},
});

const SOUND_PATHS: Record<SoundType, string> = {
  click: '/sound_effect_ui_click.mp3',
  success: '/sound_effect_success.mp3',
  levelUp: '/sound_effect_lesson_complete.mp3',
  xpGain: '/sound_effect_xp_gain.mp3',
  streakFire: '/sound_effect_streak_fire.mp3',
  questUnlock: '/sound_effect_quest_unlock.mp3',
  complete: '/sound_effect_lesson_complete.mp3',
};

const NARRATION_MAP: Record<string, string> = {
  'welcome_ar': '/speech_welcome_arabic.mp3',
  'welcome_en': '/speech_welcome_english.mp3',
  'lesson_done_ar': '/speech_lesson_done_ar.mp3',
  'lesson_done_en': '/speech_lesson_done_en.mp3',
  'streak_3_ar': '/speech_streak_3_ar.mp3',
  'streak_3_en': '/speech_streak_3_en.mp3',
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioCache = new Map<string, HTMLAudioElement>();

  const getAudio = useCallback((src: string) => {
    if (audioCache.has(src)) return audioCache.get(src)!;
    const a = new Audio(src);
    a.preload = 'auto';
    audioCache.set(src, a);
    return a;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    try {
      const a = getAudio(SOUND_PATHS[type]);
      a.currentTime = 0;
      a.volume = 0.35;
      void a.play();
    } catch {
      // Audio not critical
    }
  }, [getAudio]);

  const playNarration = useCallback((key: string) => {
    try {
      const src = NARRATION_MAP[key];
      if (!src) return;
      const a = getAudio(src);
      a.currentTime = 0;
      a.volume = 0.7;
      void a.play();
    } catch {}
  }, [getAudio]);

  return (
    <SoundContext.Provider value={{ playSound, playNarration }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
