import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Level, LEVELS, lookup } from '../data/dictionary';
import { isMastered } from '../lib/srs';
import { ACHIEVEMENTS, computeStreak, DayStats, dayKey, useStore } from '../lib/store';
import { C, LEVEL_COLOR } from '../lib/theme';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS = 12;

// 0 = nothing, 1..4 = more practice; based on minutes, with reviews and scenes counting a little
function intensity(d: DayStats | undefined, goalMin: number): number {
  if (!d) return 0;
  const min = d.seconds / 60 + d.reviews * 0.25 + d.clips * 0.5;
  if (min <= 0) return 0;
  const r = min / goalMin;
  return r >= 1 ? 4 : r >= 0.6 ? 3 : r >= 0.3 ? 2 : 1;
}
const HEAT = ['#F1ECE4', '#FFD3C6', '#FFA88F', '#FF7B5C', '#E5512F'];

function bestStreak(days: Record<string, DayStats>): number {
  const keys = Object.keys(days).filter((k) => {
    const s = days[k];
    return s.seconds >= 30 || s.reviews > 0 || s.clips > 0;
  }).sort((a, b) => a.localeCompare(b));
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of keys) {
    const [y, m, d] = k.split('-').map(Number);
    const cur = new Date(y, m - 1, d);
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return best;
}

export default function StatsScreen() {
  const { state } = useStore();
  const streak = computeStreak(state.days);
  const today = state.days[dayKey()] ?? { seconds: 0, reviews: 0, clips: 0 };
  const goalSec = state.profile.dailyGoalMin * 60;
  const pct = Math.min(1, today.seconds / goalSec);

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const s = state.days[dayKey(d)];
    return { key: dayKey(d), label: DOW[d.getDay()], min: (s?.seconds ?? 0) / 60 };
  });
  const maxMin = Math.max(state.profile.dailyGoalMin, ...week.map((w) => w.min));

  // calendar grid: columns are weeks (oldest first), rows are Sunday..Saturday
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - end.getDay() - (WEEKS - 1) * 7);
  const grid = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      return { key: dayKey(day), v: day > end ? -1 : intensity(state.days[dayKey(day)], state.profile.dailyGoalMin) };
    }),
  );
  const activeDays = Object.values(state.days).filter((d) => d.seconds >= 30 || d.reviews > 0 || d.clips > 0).length;

  const cards = Object.values(state.cards);
  const byLevel = LEVELS.map((lv) => ({ lv, n: cards.filter((c) => lookup(c.word)?.level === lv).length }));
  const otherWords = cards.length - byLevel.reduce((a, b) => a + b.n, 0);
  const mastered = cards.filter(isMastered).length;

  const totals = Object.values(state.days).reduce(
    (a, d) => ({ seconds: a.seconds + d.seconds, reviews: a.reviews + d.reviews }),
    { seconds: 0, reviews: 0 },
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.h1}>Progress</Text>

        <View style={styles.row}>
          <View style={[styles.box, { flex: 1, backgroundColor: C.accentSoft, borderColor: C.accentSoft }]}>
            <Text style={styles.big}>🔥 {streak}</Text>
            <Text style={styles.sub}>day streak</Text>
          </View>
          <View style={[styles.box, { flex: 1 }]}>
            <Text style={styles.big}>{bestStreak(state.days)}</Text>
            <Text style={styles.sub}>best streak</Text>
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.h3}>Today</Text>
          <Text style={styles.sub}>
            {Math.floor(today.seconds / 60)} of {state.profile.dailyGoalMin} min · {today.reviews} reviews · {today.clips} scenes
          </Text>
          <View style={styles.bar}><View style={[styles.barFill, { width: `${pct * 100}%` }]} /></View>
          {pct >= 1 && <Text style={[styles.sub, { color: C.teal, marginTop: 6 }]}>Daily goal reached 🎯</Text>}
        </View>

        <View style={styles.box}>
          <Text style={styles.h3}>Minutes this week</Text>
          <View style={styles.chart}>
            {week.map((w) => (
              <View key={w.key} style={styles.col}>
                <Text style={styles.colVal}>{w.min >= 1 ? Math.round(w.min) : ''}</Text>
                <View style={styles.colTrack}>
                  <View style={[styles.colFill, { height: `${(w.min / maxMin) * 100}%`, backgroundColor: w.min >= state.profile.dailyGoalMin ? C.teal : C.accent }]} />
                </View>
                <Text style={styles.sub}>{w.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.rowBetween}>
            <Text style={styles.h3}>Last {WEEKS} weeks</Text>
            <Text style={styles.sub}>{activeDays} active day{activeDays === 1 ? '' : 's'}</Text>
          </View>
          <View style={styles.heat}>
            <View style={styles.heatLabels}>
              {DAY_NAMES.map((name, i) => (
                <Text key={name} style={styles.heatLabel}>{i % 2 ? DOW[i] : ''}</Text>
              ))}
            </View>
            {grid.map((col) => (
              <View key={col[0].key} style={styles.heatCol}>
                {col.map((cell) => (
                  <View key={cell.key} style={[styles.heatCell, { backgroundColor: cell.v < 0 ? 'transparent' : HEAT[cell.v] }]} />
                ))}
              </View>
            ))}
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={styles.sub}>Less</Text>
            <View style={{ flexDirection: 'row', gap: 3 }}>
              {HEAT.map((c) => <View key={c} style={[styles.heatCell, { backgroundColor: c, width: 12 }]} />)}
            </View>
            <Text style={styles.sub}>Goal met</Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.rowBetween}>
            <Text style={styles.h3}>Your words</Text>
            <Text style={styles.sub}>{cards.length} saved · {mastered} mastered</Text>
          </View>
          {cards.length === 0 ? (
            <Text style={styles.sub}>Save words from scenes and reels to see them by level here.</Text>
          ) : (
            <>
              <View style={styles.stack}>
                {byLevel.filter((b) => b.n > 0).map((b) => (
                  <View key={b.lv} style={{ flex: b.n, backgroundColor: LEVEL_COLOR[b.lv] }} />
                ))}
                {otherWords > 0 && <View style={{ flex: otherWords, backgroundColor: LEVEL_COLOR.Other }} />}
              </View>
              <View style={styles.legend}>
                {byLevel.map((b) => (
                  <Text key={b.lv} style={styles.legendItem}>
                    <Text style={{ color: LEVEL_COLOR[b.lv as Level] }}>●</Text> {b.lv} {b.n}
                  </Text>
                ))}
                {otherWords > 0 && (
                  <Text style={styles.legendItem}><Text style={{ color: LEVEL_COLOR.Other }}>●</Text> Other {otherWords}</Text>
                )}
              </View>
            </>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.box, { flex: 1 }]}><Text style={styles.big}>{Math.round(totals.seconds / 60)}</Text><Text style={styles.sub}>total minutes</Text></View>
          <View style={[styles.box, { flex: 1 }]}><Text style={styles.big}>{totals.reviews}</Text><Text style={styles.sub}>reviews</Text></View>
          <View style={[styles.box, { flex: 1 }]}><Text style={styles.big}>{state.watched.length}</Text><Text style={styles.sub}>scenes</Text></View>
        </View>

        <Text style={[styles.h3, { marginTop: 8 }]}>Badges</Text>
        <View style={styles.badges}>
          {ACHIEVEMENTS.map((a) => {
            const got = !!state.achievements[a.id];
            return (
              <View key={a.id} style={[styles.badge, !got && { opacity: 0.4 }]}>
                <Text style={{ fontSize: 30 }}>{got ? a.emoji : '🔒'}</Text>
                <Text style={styles.badgeTitle}>{a.title}</Text>
                <Text style={[styles.sub, { fontSize: 11, textAlign: 'center' }]}>{a.desc}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  h1: { fontSize: 28, fontWeight: '800', color: C.ink, marginBottom: 12 },
  h3: { fontSize: 17, fontWeight: '800', color: C.ink, marginBottom: 4 },
  sub: { color: C.sub, fontSize: 13 },
  big: { fontSize: 26, fontWeight: '800', color: C.ink },
  row: { flexDirection: 'row', gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heat: { flexDirection: 'row', gap: 3, marginTop: 10 },
  heatLabels: { gap: 3, marginRight: 2 },
  heatLabel: { fontSize: 9, color: C.sub, height: 16, lineHeight: 16, width: 10 },
  heatCol: { flex: 1, gap: 3 },
  heatCell: { height: 16, borderRadius: 4, alignSelf: 'stretch' },
  stack: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginTop: 10, backgroundColor: C.line },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  legendItem: { fontSize: 12, color: C.ink, fontWeight: '600' },
  box: { backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.line, marginBottom: 10 },
  bar: { height: 12, borderRadius: 6, backgroundColor: C.line, marginTop: 10, overflow: 'hidden' },
  barFill: { height: 12, backgroundColor: C.accent },
  chart: { flexDirection: 'row', height: 140, alignItems: 'flex-end', gap: 8, marginTop: 8 },
  col: { flex: 1, alignItems: 'center', height: '100%' },
  colVal: { fontSize: 11, color: C.sub, height: 16 },
  colTrack: { flex: 1, width: '70%', justifyContent: 'flex-end', backgroundColor: C.bg, borderRadius: 6, overflow: 'hidden' },
  colFill: { width: '100%', borderRadius: 6 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
  badge: { width: '30%', flexGrow: 1, backgroundColor: C.card, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.line },
  badgeTitle: { fontWeight: '700', color: C.ink, marginTop: 4, fontSize: 13 },
});
