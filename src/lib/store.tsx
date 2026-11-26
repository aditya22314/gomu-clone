import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CLIPS } from '../data/clips';
import { Level, lookup, registerEntry } from '../data/dictionary';
import { Card, Grade, newCard, schedule } from './srs';

export type Profile = {
  level: Level;
  reasons: string[];
  challenges: string[];
  dailyGoalMin: number;
  reminderOn: boolean;
  reminderHour: number;
  reminderMinute: number;
  showFurigana: boolean;
  showRomaji: boolean;
  showEnglish: boolean;
  slowAudio: boolean;
};

export type DayStats = { seconds: number; reviews: number; clips: number };

export type State = {
  version: 1;
  onboarded: boolean;
  profile: Profile;
  cards: Record<string, Card>;
  days: Record<string, DayStats>;
  watched: string[];
  achievements: Record<string, number>;
  levelQuiz: Partial<Record<Level, number>>; // best score 0..100
  userReels: UserReel[];
};

export type UserReel = { id: string; videoId: string; title: string; addedAt: number };

export const DEFAULT_PROFILE: Profile = {
  level: 'N5',
  reasons: [],
  challenges: [],
  dailyGoalMin: 10,
  reminderOn: false,
  reminderHour: 20,
  reminderMinute: 0,
  showFurigana: true,
  showRomaji: true,
  showEnglish: true,
  slowAudio: false,
};

const INITIAL: State = {
  version: 1,
  onboarded: false,
  profile: DEFAULT_PROFILE,
  cards: {},
  days: {},
  watched: [],
  achievements: {},
  levelQuiz: {},
  userReels: [],
};

const KEY = 'mimi.state.v1';

export function dayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isActive(s?: DayStats) {
  return !!s && (s.seconds >= 30 || s.reviews > 0 || s.clips > 0);
}

export function computeStreak(days: Record<string, DayStats>, today = new Date()): number {
  let streak = 0;
  const d = new Date(today);
  // today counts if active; if not, the streak is still alive from yesterday
  if (!isActive(days[dayKey(d)])) d.setDate(d.getDate() - 1);
  while (isActive(days[dayKey(d)])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export type Achievement = { id: string; title: string; desc: string; emoji: string; test: (s: State) => boolean };

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-word', emoji: '🌱', title: 'First word', desc: 'Save your first word', test: (s) => Object.keys(s.cards).length >= 1 },
  { id: 'words-25', emoji: '📚', title: 'Word collector', desc: 'Save 25 words', test: (s) => Object.keys(s.cards).length >= 25 },
  { id: 'words-100', emoji: '🏯', title: 'Word hoard', desc: 'Save 100 words', test: (s) => Object.keys(s.cards).length >= 100 },
  { id: 'clips-20', emoji: '📺', title: 'Regular', desc: 'Watch 20 different scenes', test: (s) => s.watched.length >= 20 },
  { id: 'clips-5', emoji: '🎬', title: 'Binge starter', desc: 'Watch 5 different scenes', test: (s) => s.watched.length >= 5 },
  { id: 'clips-all', emoji: '🍿', title: 'Seen it all', desc: 'Watch every scene', test: (s) => s.watched.length >= CLIPS.length },
  { id: 'streak-3', emoji: '🔥', title: 'On fire', desc: '3 day streak', test: (s) => computeStreak(s.days) >= 3 },
  { id: 'streak-7', emoji: '🗓️', title: 'One week', desc: '7 day streak', test: (s) => computeStreak(s.days) >= 7 },
  { id: 'streak-30', emoji: '🌕', title: 'Full moon', desc: '30 day streak', test: (s) => computeStreak(s.days) >= 30 },
  { id: 'reviews-50', emoji: '🧠', title: 'Memory palace', desc: 'Do 50 reviews', test: (s) => Object.values(s.days).reduce((a, d) => a + d.reviews, 0) >= 50 },
  { id: 'goal-met', emoji: '🎯', title: 'Goal!', desc: 'Hit your daily goal', test: (s) => (s.days[dayKey()]?.seconds ?? 0) >= s.profile.dailyGoalMin * 60 },
  { id: 'level-pass', emoji: '🏅', title: 'Level up ready', desc: 'Pass a level quiz', test: (s) => Object.values(s.levelQuiz).some((v) => (v ?? 0) >= 80) },
];

function withAchievements(s: State): State {
  let changed = false;
  const a = { ...s.achievements };
  for (const ach of ACHIEVEMENTS) {
    if (!a[ach.id] && ach.test(s)) {
      a[ach.id] = Date.now();
      changed = true;
    }
  }
  return changed ? { ...s, achievements: a } : s;
}

function bumpDay(s: State, patch: Partial<DayStats>): State {
  const k = dayKey();
  const cur = s.days[k] ?? { seconds: 0, reviews: 0, clips: 0 };
  return {
    ...s,
    days: {
      ...s.days,
      [k]: {
        seconds: cur.seconds + (patch.seconds ?? 0),
        reviews: cur.reviews + (patch.reviews ?? 0),
        clips: cur.clips + (patch.clips ?? 0),
      },
    },
  };
}

type Actions = {
  completeOnboarding: (p: Partial<Profile>) => void;
  updateProfile: (p: Partial<Profile>) => void;
  saveWord: (word: string, clipId: string, lineJp: string, lineEn: string) => void;
  removeWord: (word: string) => void;
  addReel: (videoId: string, title: string) => void;
  removeReel: (videoId: string) => void;
  review: (word: string, grade: Grade) => void;
  addWatchSeconds: (sec: number) => void;
  markClipWatched: (clipId: string) => void;
  recordLevelQuiz: (level: Level, score: number) => void;
  resetAll: () => Promise<void>;
  exportData: () => string;
  importData: (json: string) => { ok: true; words: number } | { ok: false; error: string };
};

type Ctx = { state: State; loaded: boolean } & Actions;

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as State;
          Object.values(parsed.cards ?? {}).forEach((c) => c.entry && registerEntry(c.entry));
          setState({ ...INITIAL, ...parsed, profile: { ...DEFAULT_PROFILE, ...parsed.profile } });
        }
      } catch {
        // start fresh if storage is unreadable
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
  }, [state, loaded]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const update = useCallback((fn: (s: State) => State) => setState((s) => withAchievements(fn(s))), []);

  const actions: Actions = useMemo(
    () => ({
      completeOnboarding: (p) => update((s) => ({ ...s, onboarded: true, profile: { ...s.profile, ...p } })),
      updateProfile: (p) => update((s) => ({ ...s, profile: { ...s.profile, ...p } })),
      saveWord: (word, clipId, lineJp, lineEn) =>
        update((s) =>
          s.cards[word] ? s : { ...s, cards: { ...s.cards, [word]: newCard(word, clipId, lineJp, lineEn, Date.now(), lookup(word)) } },
        ),
      addReel: (videoId, title) =>
        update((s) =>
          s.userReels.some((r) => r.videoId === videoId)
            ? s
            : { ...s, userReels: [{ id: `user-${videoId}`, videoId, title, addedAt: Date.now() }, ...s.userReels] },
        ),
      removeReel: (videoId) => update((s) => ({ ...s, userReels: s.userReels.filter((r) => r.videoId !== videoId) })),
      removeWord: (word) =>
        update((s) => {
          const cards = { ...s.cards };
          delete cards[word];
          return { ...s, cards };
        }),
      review: (word, grade) =>
        update((s) => {
          const c = s.cards[word];
          if (!c) return s;
          return bumpDay({ ...s, cards: { ...s.cards, [word]: schedule(c, grade) } }, { reviews: 1 });
        }),
      addWatchSeconds: (sec) => update((s) => bumpDay(s, { seconds: sec })),
      markClipWatched: (clipId) =>
        update((s) => {
          const s2 = bumpDay(s, { clips: 1 });
          return s.watched.includes(clipId) ? s2 : { ...s2, watched: [...s.watched, clipId] };
        }),
      recordLevelQuiz: (level, score) =>
        update((s) => ({ ...s, levelQuiz: { ...s.levelQuiz, [level]: Math.max(score, s.levelQuiz[level] ?? 0) } })),
      resetAll: async () => {
        await AsyncStorage.removeItem(KEY).catch(() => {});
        setState(INITIAL);
      },
      exportData: () => JSON.stringify({ app: 'mimi', exportedAt: new Date().toISOString(), state: stateRef.current }),
      importData: (json) => {
        let parsed: { app?: string; state?: State };
        try {
          parsed = JSON.parse(json.trim());
        } catch {
          return { ok: false, error: "That doesn't look like a Mimi backup. Paste the whole text you exported." };
        }
        const incoming = parsed?.state;
        if (parsed?.app !== 'mimi' || !incoming || typeof incoming.cards !== 'object') {
          return { ok: false, error: "That doesn't look like a Mimi backup. Paste the whole text you exported." };
        }
        Object.values(incoming.cards).forEach((c) => c.entry && registerEntry(c.entry));
        setState({
          ...INITIAL,
          ...incoming,
          onboarded: true,
          profile: { ...DEFAULT_PROFILE, ...incoming.profile },
          userReels: incoming.userReels ?? [],
        });
        return { ok: true, words: Object.keys(incoming.cards).length };
      },
    }),
    [update],
  );

  return <StoreContext.Provider value={{ state, loaded, ...actions }}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
