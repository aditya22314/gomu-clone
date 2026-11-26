import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ACHIEVEMENTS, computeStreak, dayKey, useStore } from '../lib/store';
import { C } from '../lib/theme';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
    return { label: DOW[d.getDay()], min: (s?.seconds ?? 0) / 60 };
  });
  const maxMin = Math.max(state.profile.dailyGoalMin, ...week.map((w) => w.min));

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
            <Text style={styles.big}>{Object.keys(state.cards).length}</Text>
            <Text style={styles.sub}>words saved</Text>
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
            {week.map((w, i) => (
              <View key={i} style={styles.col}>
                <Text style={styles.colVal}>{w.min >= 1 ? Math.round(w.min) : ''}</Text>
                <View style={styles.colTrack}>
                  <View style={[styles.colFill, { height: `${(w.min / maxMin) * 100}%`, backgroundColor: w.min >= state.profile.dailyGoalMin ? C.teal : C.accent }]} />
                </View>
                <Text style={styles.sub}>{w.label}</Text>
              </View>
            ))}
          </View>
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
