// A small SM-2 style scheduler.
import type { Entry } from '../data/dictionary';
export type Grade = 'again' | 'hard' | 'good' | 'easy';

export type Card = {
  word: string; // dictionary surface
  addedAt: number;
  due: number; // epoch ms
  interval: number; // days
  ease: number;
  reps: number;
  lapses: number;
  clipId: string;
  lineJp: string;
  lineEn: string;
  entry?: Entry; // snapshot, so words looked up online still work offline
};

const DAY = 24 * 60 * 60 * 1000;

export function newCard(word: string, clipId: string, lineJp: string, lineEn: string, now = Date.now(), entry?: Entry): Card {
  return { word, addedAt: now, due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0, clipId, lineJp, lineEn, entry };
}

export function schedule(card: Card, grade: Grade, now = Date.now()): Card {
  let { interval, ease, reps, lapses } = card;
  if (grade === 'again') {
    lapses += 1;
    reps = 0;
    ease = Math.max(1.3, ease - 0.2);
    // see it again in 10 minutes
    return { ...card, interval: 0, ease, reps, lapses, due: now + 10 * 60 * 1000 };
  }
  if (grade === 'hard') ease = Math.max(1.3, ease - 0.15);
  if (grade === 'easy') ease = ease + 0.15;
  if (reps === 0) interval = grade === 'easy' ? 3 : grade === 'hard' ? 0.5 : 1;
  else if (reps === 1) interval = grade === 'easy' ? 7 : grade === 'hard' ? 2 : 3;
  else interval = Math.max(1, interval * (grade === 'hard' ? 1.2 : grade === 'easy' ? ease * 1.3 : ease));
  reps += 1;
  return { ...card, interval, ease, reps, lapses, due: now + interval * DAY };
}

export function isDue(card: Card, now = Date.now()) {
  return card.due <= now;
}

export function describeDue(card: Card, now = Date.now()): string {
  const diff = card.due - now;
  if (diff <= 0) return 'Due now';
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `In ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `In ${hours}h`;
  return `In ${Math.round(hours / 24)}d`;
}
