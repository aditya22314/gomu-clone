// Small sanity tests for romaji, spaced repetition and streaks. Run: npx tsx scripts/test-logic.ts
import assert from 'node:assert/strict';
import { toRomaji } from '../src/lib/romaji';
import { newCard, schedule } from '../src/lib/srs';
import { computeStreak, dayKey } from '../src/lib/store';

assert.equal(toRomaji('たすけて'), 'tasukete');
assert.equal(toRomaji('しゅくだい'), 'shukudai');
assert.equal(toRomaji('ちこく'), 'chikoku');
assert.equal(toRomaji('いっしょに'), 'issho' + 'ni');
assert.equal(toRomaji('こーひー'), 'koohii');
assert.equal(toRomaji('は', true), 'wa');
assert.equal(toRomaji('きゅうか'), 'kyuuka');
assert.equal(toRomaji('れんらく'), 'renraku');

const DAY = 86400000;
const t0 = 1_700_000_000_000;
let c = newCard('助けて', 'why-help', 'x', 'y', t0);
c = schedule(c, 'good', t0);
assert.equal(c.due, t0 + DAY);
c = schedule(c, 'good', t0);
assert.equal(c.due, t0 + 3 * DAY);
c = schedule(c, 'good', t0);
assert.ok(c.interval > 3);
const lapsed = schedule(c, 'again', t0);
assert.equal(lapsed.reps, 0);
assert.ok(lapsed.due - t0 < DAY);

const today = new Date();
const days: Record<string, { seconds: number; reviews: number; clips: number }> = {};
for (let i = 1; i <= 3; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  days[dayKey(d)] = { seconds: 60, reviews: 0, clips: 1 };
}
assert.equal(computeStreak(days, today), 3); // today not done yet: streak still alive
days[dayKey(today)] = { seconds: 0, reviews: 2, clips: 0 };
assert.equal(computeStreak(days, today), 4);

console.log('OK: logic tests passed');
