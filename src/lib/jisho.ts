import { Entry, Level, lookup, registerEntry } from '../data/dictionary';
import { toHiragana } from './romaji';

// Online lookups for words that aren't in the built-in dictionary (for example, words in real video subtitles).
// Uses Jisho.org's public search API. Results are cached and saved with the card, so reviews work offline.

type JishoResult = {
  slug: string;
  jlpt: string[];
  japanese: { word?: string; reading?: string }[];
  senses: { english_definitions: string[]; parts_of_speech: string[] }[];
};

const pending: Record<string, Promise<Entry | null>> = {};

function levelFrom(tags: string[]): Level | 'Other' {
  const levels = tags.map((t) => t.replace('jlpt-', '').toUpperCase()).filter((t) => /^N[1-5]$/.test(t)) as Level[];
  // jisho lists the easiest level first when there are several
  return [...levels].sort((a, b) => b.localeCompare(a))[0] ?? 'Other';
}

export function lookupOnline(surface: string, hint?: { reading?: string; base?: string; pos?: string }): Promise<Entry | null> {
  const known = lookup(surface);
  if (known) return Promise.resolve(known);
  if (surface in pending) return pending[surface];
  const query = hint?.base && hint.base !== '*' ? hint.base : surface;
  pending[surface] = fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}`)
    .then((r) => r.json())
    .then((json: { data: JishoResult[] }) => {
      const hit = json.data?.[0];
      if (!hit) return null;
      const jp = hit.japanese[0] ?? {};
      const sense = hit.senses[0];
      const entry: Entry = {
        surface,
        reading: toHiragana(hint?.reading ?? jp.reading ?? surface),
        meaning: hit.senses
          .slice(0, 2)
          .map((s) => s.english_definitions.slice(0, 3).join('; '))
          .join(' / '),
        level: levelFrom(hit.jlpt),
        pos: (hint?.pos ?? sense?.parts_of_speech?.[0] ?? 'word').toLowerCase(),
        base: query !== surface ? query : undefined,
      };
      registerEntry(entry);
      return entry;
    })
    .catch(() => {
      delete pending[surface];
      return null;
    });
  return pending[surface];
}
