// Fetches a YouTube video's own captions on the phone while it plays, and turns them into
// tap-to-learn subtitle lines. Nothing is bundled with the app: the caption text comes from
// YouTube at watch time, the same captions YouTube's player shows, and is cached on the device.
//
// The steps mirror how YouTube's Android app asks for captions: read the API key from the watch
// page, ask the player endpoint for the caption tracks, then download the chosen track.
import TinySegmenter from 'tiny-segmenter';
import type { ReelLine, ReelToken } from '../data/reels';

type Track = { baseUrl: string; languageCode: string; kind?: string };
type Cue = { start: number; end: number; text: string };

const CLIENT = { clientName: 'ANDROID', clientVersion: '20.10.38' };

async function captionTracks(videoId: string): Promise<Track[]> {
  const page = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=ja`).then((r) => r.text());
  const key = /"INNERTUBE_API_KEY":\s*"([\w-]+)"/.exec(page)?.[1];
  if (!key) return [];
  const res = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context: { client: CLIENT }, videoId }),
  });
  const data = (await res.json()) as { captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: Track[] } } };
  return data.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };

function decode(s: string): string {
  return s.replace(/&(amp|lt|gt|quot|apos|#39);/g, (_, e: string) => ENTITIES[e]).replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)));
}

// Removes caption tags such as [音楽] or [Music].
function dropTags(text: string): string {
  let out = '';
  let depth = 0;
  for (const ch of text) {
    if (ch === '[') depth++;
    else if (ch === ']') depth = Math.max(0, depth - 1);
    else if (depth === 0) out += ch;
  }
  return out;
}

// YouTube's timed-text XML: <text start="1.2" dur="3.4">line</text>
export function parseTimedText(xml: string, sep: string): Cue[] {
  const cues: Cue[] = [];
  for (const m of xml.matchAll(/<text start="([\d.]+)" dur="([\d.]+)"[^>]*>([^<]*)<\/text>/g)) {
    const text = dropTags(decode(decode(m[3])))
      .split(/\s/)
      .filter(Boolean)
      .join(sep);
    if (text) cues.push({ start: Number(m[1]), end: Number(m[1]) + Number(m[2]), text });
  }
  // auto-generated captions overlap; end each line when the next one starts
  for (let i = 0; i < cues.length - 1; i++) cues[i].end = Math.min(cues[i].end, cues[i + 1].start);
  return cues;
}

let segmenter: { segment: (s: string) => string[] } | null = null;
const PUNCT = /^[\s、。！？!?「」『』（）()…・ー〜~,.:;"'-]+$/u;

export function tokenize(text: string): ReelToken[] {
  segmenter ??= new TinySegmenter();
  return segmenter.segment(text).map((s) => (PUNCT.test(s) ? { s } : { s, p: 'word' }));
}

const pick = (tracks: Track[], lang: string) =>
  tracks.find((t) => t.languageCode === lang && t.kind !== 'asr') ?? tracks.find((t) => t.languageCode === lang);

// Only the query string of YouTube's track URL is used: the request always goes to YouTube's own
// timed-text address, whatever the player response says.
const TIMED_TEXT = 'https://www.youtube.com/api/timedtext?';

async function download(track: Track): Promise<string> {
  const params = new URL(track.baseUrl).searchParams;
  params.delete('fmt');
  return fetch(TIMED_TEXT + params.toString()).then((r) => r.text());
}

// Returns timed lines with English where YouTube has English captions, or [] when the video has no Japanese captions.
export async function fetchCaptionLines(videoId: string): Promise<ReelLine[]> {
  const tracks = await captionTracks(videoId);
  const ja = pick(tracks, 'ja');
  if (!ja) return [];
  const en = pick(tracks, 'en');
  const [jaXml, enXml] = await Promise.all([download(ja), en ? download(en) : Promise.resolve('')]);
  const enCues = enXml ? parseTimedText(enXml, ' ') : [];
  return parseTimedText(jaXml, '').map((c) => {
    const mid = (c.start + c.end) / 2;
    const tr = enCues.find((e) => mid >= e.start && mid <= e.end);
    return { start: c.start, end: c.end, tokens: tokenize(c.text), ...(tr ? { en: tr.text } : {}) };
  });
}
