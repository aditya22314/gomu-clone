import type { Level } from './dictionary';
import { GENERATED_REELS } from './reels.generated';

// A token from the subtitle tokenizer: surface, reading (hiragana), dictionary form, part of speech.
export type ReelToken = { s: string; r?: string; b?: string; p?: string };
export type ReelLine = { start: number; end: number; tokens: ReelToken[]; en?: string };

export type Reel = {
  id: string;
  videoId: string; // YouTube video id, played through YouTube's official embedded player
  title: string;
  channel: string; // credited on screen
  level: Level | 'Other';
  start?: number;
  end?: number;
  lines?: ReelLine[]; // timed Japanese subtitles, made with scripts/import-subtitles.ts
};

export const REELS: Reel[] = GENERATED_REELS;

export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
