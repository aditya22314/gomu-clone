import type { Level } from './dictionary';
import data from './officialClips.json';

// Clips from anime that the rights holders publish themselves on YouTube (Crunchyroll, Aniplex).
// They play through YouTube's own embedded player: nothing is downloaded or re-hosted, the views
// and ads go to the channel, and the channel is credited on screen. If a channel turns off
// embedding or a clip is blocked in the viewer's country, the player reports an error and the
// card offers "Open on YouTube" and "Next clip" instead.
//
// The list lives in officialClips.json:
//   shows: { id, name, jp, color, words: [word, reading, meaning, JLPT level or "Other" or null][] }
//   clips: [videoId, show id, title, channel, level, has Japanese captions on YouTube][]

// lv: rough JLPT level, or Other for words that are not on the usual lists
export type ShowWord = { w: string; r: string; en: string; lv?: Level | 'Other' };

export type Show = { id: string; name: string; jp: string; color: string; words: ShowWord[] };

export type OfficialClip = { videoId: string; show: string; title: string; channel: string; level: Level; jaCaptions?: boolean };

type WordRow = [string, string, string, string | null];
type ClipRow = [string, string, string, string, string, boolean];

export const SHOWS: Show[] = data.shows.map((s) => ({
  ...s,
  words: (s.words as WordRow[]).map(([w, r, en, lv]) => ({ w, r, en, ...(lv ? { lv: lv as ShowWord['lv'] } : {}) })),
}));

export const OFFICIAL_CLIPS: OfficialClip[] = (data.clips as ClipRow[]).map(([videoId, show, title, channel, level, jaCaptions]) => ({
  videoId,
  show,
  title,
  channel,
  level: level as Level,
  ...(jaCaptions ? { jaCaptions } : {}),
}));

export const showById = (id?: string) => SHOWS.find((s) => s.id === id);
