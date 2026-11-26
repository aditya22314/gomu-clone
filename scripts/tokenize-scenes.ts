// Helper for writing new scenes: splits Japanese lines into word chunks with kuromoji
// and lists the words that still need a dictionary entry.
//   npx tsx scripts/tokenize-scenes.ts scripts/new-scenes.json > out.json
import fs from 'node:fs';
import path from 'node:path';
import kuromoji from 'kuromoji';
import { lookup } from '../src/data/dictionary';

const POS: Record<string, string> = {
  名詞: 'noun', 動詞: 'verb', 形容詞: 'adjective', 助詞: 'particle', 助動詞: 'auxiliary', 副詞: 'adverb',
  連体詞: 'pre-noun', 接続詞: 'conjunction', 感動詞: 'interjection', 接頭詞: 'prefix', 記号: 'symbol', フィラー: 'filler',
};
const k2h = (s: string) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

type Chunk = { s: string; r: string; b: string; p: string };

async function main() {
  const tokenizer = await new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>((res, rej) =>
    kuromoji.builder({ dicPath: path.join('node_modules', 'kuromoji', 'dict') }).build((e, t) => (e ? rej(e) : res(t))),
  );
  const scenes = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const missing: Record<string, Chunk & { count: number; example: string }> = {};
  for (const sc of scenes) {
    for (const line of sc.lines) {
      const toks = tokenizer.tokenize(line[2]);
      const chunks: Chunk[] = [];
      for (const t of toks) {
        const prev = chunks[chunks.length - 1];
        const r = t.reading && t.reading !== '*' ? k2h(t.reading) : k2h(t.surface_form);
        const glue =
          prev &&
          (prev.p === 'verb' || prev.p === 'adjective' || prev.p === 'auxiliary' || (prev.p === 'noun' && t.pos === '動詞' && t.basic_form === 'する')) &&
          (t.pos === '助動詞' ||
            (t.pos === '助詞' && t.pos_detail_1 === '接続助詞' && ['て', 'で', 'ちゃ'].includes(t.surface_form)) ||
            (t.pos === '動詞' && (t.pos_detail_1 === '非自立' || t.pos_detail_1 === '接尾')) ||
            (t.pos === '動詞' && t.basic_form === 'する' && prev.p === 'noun') ||
            (t.pos === '形容詞' && t.pos_detail_1 === '非自立'));
        if (glue && !(prev.p === 'noun' && !(t.pos === '動詞' && t.basic_form === 'する'))) {
          prev.s += t.surface_form;
          prev.r += r;
          if (prev.p === 'noun') prev.p = 'verb';
        } else if (t.pos === '名詞' && t.pos_detail_1 === '接尾' && prev && prev.p === 'noun') {
          prev.s += t.surface_form;
          prev.r += r;
          prev.b = prev.s;
        } else {
          chunks.push({ s: t.surface_form, r, b: t.basic_form !== '*' ? t.basic_form : t.surface_form, p: POS[t.pos] ?? t.pos });
        }
      }
      line[2] = chunks.map((c) => c.s).join(' ');
      for (const c of chunks) {
        if (c.p === 'symbol' || lookup(c.s)) continue;
        missing[c.s] ??= { ...c, count: 0, example: line[2] };
        missing[c.s].count++;
      }
    }
  }
  fs.writeFileSync(process.argv[3], JSON.stringify(scenes, null, 1));
  console.log(Object.values(missing).map((m) => `${m.s}|${m.r}|${m.b}|${m.p}`).join('\n'));
  console.error(`${Object.keys(missing).length} words need entries`);
}
main();
