// Offline cache utilities for Smart Venom K Academy
// Caches lesson data, code drafts, quiz answers, and page data in localStorage

const PREFIX = "svk_cache_";

function key(k: string) {
  return PREFIX + k;
}

export const offlineCache = {
  // --- Code drafts (auto-save in editor) ---
  saveCodeDraft(lessonId: number, code: string) {
    try {
      localStorage.setItem(key(`code_${lessonId}`), code);
      localStorage.setItem(key(`code_${lessonId}_ts`), Date.now().toString());
    } catch {}
  },

  loadCodeDraft(lessonId: number): string | null {
    try {
      return localStorage.getItem(key(`code_${lessonId}`));
    } catch {
      return null;
    }
  },

  clearCodeDraft(lessonId: number) {
    try {
      localStorage.removeItem(key(`code_${lessonId}`));
      localStorage.removeItem(key(`code_${lessonId}_ts`));
    } catch {}
  },

  // --- Quiz answers ---
  saveQuizAnswers(lessonId: number, answers: Record<number, string>) {
    try {
      localStorage.setItem(key(`quiz_${lessonId}`), JSON.stringify(answers));
    } catch {}
  },

  loadQuizAnswers(lessonId: number): Record<number, string> | null {
    try {
      const raw = localStorage.getItem(key(`quiz_${lessonId}`));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearQuizAnswers(lessonId: number) {
    try {
      localStorage.removeItem(key(`quiz_${lessonId}`));
    } catch {}
  },

  // --- Lesson data cache ---
  saveLesson(lessonId: number, data: any) {
    try {
      localStorage.setItem(key(`lesson_${lessonId}`), JSON.stringify(data));
      localStorage.setItem(key(`lesson_${lessonId}_ts`), Date.now().toString());
    } catch {}
  },

  loadLesson(lessonId: number): any | null {
    try {
      const raw = localStorage.getItem(key(`lesson_${lessonId}`));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // --- Courses list cache ---
  saveCourses(data: any[]) {
    try {
      localStorage.setItem(key("courses"), JSON.stringify(data));
      localStorage.setItem(key("courses_ts"), Date.now().toString());
    } catch {}
  },

  loadCourses(): any[] | null {
    try {
      const raw = localStorage.getItem(key("courses"));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // --- Course detail cache ---
  saveCourse(slug: string, data: any) {
    try {
      localStorage.setItem(key(`course_${slug}`), JSON.stringify(data));
      localStorage.setItem(key(`course_${slug}_ts`), Date.now().toString());
    } catch {}
  },

  loadCourse(slug: string): any | null {
    try {
      const raw = localStorage.getItem(key(`course_${slug}`));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // --- Dashboard cache ---
  saveDashboard(data: any) {
    try {
      localStorage.setItem(key("dashboard"), JSON.stringify(data));
      localStorage.setItem(key("dashboard_ts"), Date.now().toString());
    } catch {}
  },

  loadDashboard(): any | null {
    try {
      const raw = localStorage.getItem(key("dashboard"));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // --- Leaderboard cache ---
  saveLeaderboard(data: any) {
    try {
      localStorage.setItem(key("leaderboard"), JSON.stringify(data));
      localStorage.setItem(key("leaderboard_ts"), Date.now().toString());
    } catch {}
  },

  loadLeaderboard(): any | null {
    try {
      const raw = localStorage.getItem(key("leaderboard"));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // --- Pending actions queue (for when offline) ---
  queueAction(action: { type: string; payload: any }) {
    try {
      const queue = this.getActionQueue();
      queue.push({ ...action, timestamp: Date.now() });
      localStorage.setItem(key("action_queue"), JSON.stringify(queue));
    } catch {}
  },

  getActionQueue(): any[] {
    try {
      const raw = localStorage.getItem(key("action_queue"));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearActionQueue() {
    try {
      localStorage.removeItem(key("action_queue"));
    } catch {}
  },

  // --- General util ---
  isStale(tsKey: string, maxAgeMs: number = 1000 * 60 * 60 * 24): boolean {
    try {
      const ts = localStorage.getItem(key(tsKey));
      if (!ts) return true;
      return Date.now() - parseInt(ts, 10) > maxAgeMs;
    } catch {
      return true;
    }
  },

  clearAll() {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}
  },
};

// Hook: online/offline status with toast notification
let hasNotifiedOffline = false;

export function setupOfflineListener(notify: (message: string, type?: "info" | "warning") => void) {
  const handleOnline = () => {
    hasNotifiedOffline = false;
    notify("انت متصل بالإنترنت! جاري تزامن البيانات...", "info");
    // Auto-sync queued actions could be triggered here
  };
  const handleOffline = () => {
    if (!hasNotifiedOffline) {
      hasNotifiedOffline = true;
      notify("انقطع الاتصال بالإنترنت. البيانات متوفرة من الذاكرة المحلية فقط.", "warning");
    }
  };
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}
