// Checks that every word in every scene has a dictionary entry.
import { CLIPS } from '../src/data/clips';
import { isPunctuation, lookup } from '../src/data/dictionary';

let missing = 0;
for (const clip of CLIPS) {
  for (const line of clip.lines) {
    for (const t of line.jp.split(' ').filter(Boolean)) {
      if (!isPunctuation(t) && !lookup(t)) {
        console.log(`missing: "${t}" in ${clip.id}`);
        missing++;
      }
    }
  }
}
const ids = new Set(CLIPS.map((c) => c.id));
if (ids.size !== CLIPS.length) { console.log('duplicate clip ids'); missing++; }
console.log(missing ? `${missing} problem(s)` : `OK: ${CLIPS.length} scenes, all words covered`);
process.exit(missing ? 1 : 0);
