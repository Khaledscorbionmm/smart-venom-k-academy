import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Volume2, Languages, Headphones } from "lucide-react";

type Props = {
  textAr: string;
  textEn: string;
  audioUrlAr?: string | null;
  audioUrlEn?: string | null;
  label?: string;
};

export function AudioPlayer({ textAr, textEn, audioUrlAr, audioUrlEn, label }: Props) {
  const [supported, setSupported] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeLang, setActiveLang] = useState<"ar" | "en">("ar");
  const [rate, setRate] = useState(1);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
    return () => {
      try { window.speechSynthesis?.cancel(); } catch {}
      try { audioRef.current?.pause(); } catch {}
    };
  }, []);

  const hasPreRecordedAr = !!audioUrlAr;
  const hasPreRecordedEn = !!audioUrlEn;

  const playPreRecorded = (url: string, lang: "ar" | "en") => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.onended = () => { setPlaying(false); setPaused(false); };
    audio.onerror = () => { setPlaying(false); setPaused(false); };
    audioRef.current = audio;
    setActiveLang(lang);
    setPlaying(true);
    setPaused(false);
    audio.play().catch(() => { setPlaying(false); });
  };

  const speak = (lang: "ar" | "en") => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = lang === "ar" ? textAr : textEn;
    if (!text || !text.trim()) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "ar" ? "ar-SA" : "en-US";
    u.rate = rate;
    u.pitch = 1;
    u.onend = () => { setPlaying(false); setPaused(false); };
    u.onerror = () => { setPlaying(false); setPaused(false); };
    utterRef.current = u;
    setActiveLang(lang);
    setPlaying(true);
    setPaused(false);
    window.speechSynthesis.speak(u);
  };

  const togglePause = () => {
    if (audioRef.current) {
      if (paused) { audioRef.current.play().catch(() => {}); setPaused(false); }
      else { audioRef.current.pause(); setPaused(true); }
      return;
    }
    if (!window.speechSynthesis) return;
    if (paused) { window.speechSynthesis.resume(); setPaused(false); }
    else { window.speechSynthesis.pause(); setPaused(true); }
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlaying(false);
    setPaused(false);
  };

  if (!supported && !hasPreRecordedAr && !hasPreRecordedEn) return null;

  const handlePlayAr = () => {
    if (hasPreRecordedAr && audioUrlAr) playPreRecorded(audioUrlAr, "ar");
    else speak("ar");
  };

  const handlePlayEn = () => {
    if (hasPreRecordedEn && audioUrlEn) playPreRecorded(audioUrlEn, "en");
    else speak("en");
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-transparent p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Volume2 className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm">{label || "استمع للدرس / Listen to Lesson"}</div>
          <div className="text-xs text-muted-foreground">
            {hasPreRecordedAr || hasPreRecordedEn
              ? "تسجيل احترافي بصوت واضح / Professional narration"
              : "شغّل التسجيل الصوتي بأي لغة"}
          </div>
        </div>
        {(hasPreRecordedAr || hasPreRecordedEn) && (
          <Headphones className="w-4 h-4 text-green-400 shrink-0" />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Button
          size="sm"
          variant={playing && activeLang === "ar" ? "default" : "outline"}
          onClick={handlePlayAr}
          className="gap-1.5"
        >
          <Languages className="w-3.5 h-3.5" />
          {hasPreRecordedAr ? "عربي (تسجيل)" : "عربي (TTS)"}
        </Button>
        <Button
          size="sm"
          variant={playing && activeLang === "en" ? "default" : "outline"}
          onClick={handlePlayEn}
          className="gap-1.5"
        >
          <Languages className="w-3.5 h-3.5" />
          {hasPreRecordedEn ? "English (Recorded)" : "English (TTS)"}
        </Button>

        {playing && (
          <>
            <Button size="sm" variant="ghost" onClick={togglePause} className="gap-1.5">
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {paused ? "متابعة" : "إيقاف مؤقت"}
            </Button>
            <Button size="sm" variant="ghost" onClick={stop} className="gap-1.5 text-red-500">
              <Square className="w-3.5 h-3.5" />
              إيقاف
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground shrink-0">السرعة / Speed</span>
        <Slider
          value={[rate]}
          onValueChange={(v) => {
            setRate(v[0]);
            if (audioRef.current) audioRef.current.playbackRate = v[0];
          }}
          min={0.5}
          max={1.75}
          step={0.25}
          className="flex-1 max-w-[200px]"
        />
        <span className="text-xs font-mono text-primary w-10 text-end">{rate.toFixed(2)}x</span>
      </div>
    </Card>
  );
}
