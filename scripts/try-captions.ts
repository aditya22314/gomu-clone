// Checks that on-device caption fetching works for a video: npx tsx scripts/try-captions.ts CmsXraEmC90
import { fetchCaptionLines } from '../src/lib/captions';

const id = process.argv[2] ?? 'CmsXraEmC90';
fetchCaptionLines(id)
  .then((lines) => {
    console.log(`${id}: ${lines.length} lines`);
    for (const l of lines.slice(0, 5)) console.log(l.start.toFixed(1), l.end.toFixed(1), l.tokens.map((t) => t.s).join('|'), l.en ?? '');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
