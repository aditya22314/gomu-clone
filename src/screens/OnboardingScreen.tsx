import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, Stepper } from '../components/Choice';
import SceneArt from '../components/SceneArt';
import { Level, LEVELS } from '../data/dictionary';
import { scheduleDailyReminder } from '../lib/notifications';
import { useStore } from '../lib/store';
import { C, LEVEL_COLOR } from '../lib/theme';
import { formatTime } from './ProfileScreen';

const LEVEL_DESC: Record<Level, string> = {
  N5: 'Just starting: kana and basic phrases',
  N4: 'I know everyday basics',
  N3: 'I can follow simple conversations',
  N2: 'I understand most daily Japanese',
  N1: 'Advanced: news, business, nuance',
};
const REASONS = ['Anime & manga', 'Travel', 'JLPT exam', 'Work', 'Friends & family', 'Living in Japan', 'Just for fun'];
const CHALLENGES = ['Listening', 'Vocabulary', 'Kanji', 'Speaking', 'Grammar', 'Staying consistent'];

export default function OnboardingScreen() {
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level>('N5');
  const [reasons, setReasons] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [goal, setGoal] = useState(10);
  const [hour, setHour] = useState(20);

  const toggle = (arr: string[], set: (a: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const finish = async (reminder: boolean) => {
    let reminderOn = false;
    if (reminder) reminderOn = await scheduleDailyReminder(hour, 0);
    completeOnboarding({ level, reasons, challenges, dailyGoalMin: goal, reminderOn, reminderHour: hour, reminderMinute: 0 });
  };

  const steps = [
    <View key="hello" style={styles.center}>
      <View style={styles.hero}>
        <SceneArt
          backdrop="city-dusk"
          talking
          speaker="Mei"
          cast={[
            { name: 'Haru', hair: 'spiky', hairColor: '#2A2238', shirt: '#2E3F6E' },
            { name: 'Mei', hair: 'ponytail', hairColor: '#5A3A2A', shirt: '#F28BA8' },
          ]}
        />
        <View style={styles.heroBubble}><Text style={styles.heroBubbleText}>いっしょに 日本語を 学ぼう！</Text></View>
      </View>
      <Text style={styles.logo}>mimi<Text style={{ color: C.accent }}>耳</Text></Text>
      <Text style={styles.title}>Learn Japanese from scenes and real videos.</Text>
      <Text style={styles.sub}>50 animated scenes from N5 to N1, plus any YouTube video you add. Tap a word to see what it means, save it, and review it right before you'd forget it. Free, with no ads and no account.</Text>
    </View>,
    <View key="level">
      <Text style={styles.title}>What's your Japanese level?</Text>
      <Text style={styles.sub}>You can change this anytime.</Text>
      {LEVELS.map((lv) => (
        <Pressable key={lv} onPress={() => setLevel(lv)} style={[styles.option, level === lv && { borderColor: LEVEL_COLOR[lv], backgroundColor: '#fff' }]}>
          <Text style={[styles.levelTag, { backgroundColor: LEVEL_COLOR[lv] }]}>{lv}</Text>
          <Text style={styles.optionText}>{LEVEL_DESC[lv]}</Text>
          {level === lv && <Text>✓</Text>}
        </Pressable>
      ))}
    </View>,
    <View key="why">
      <Text style={styles.title}>Why are you learning?</Text>
      <Text style={styles.sub}>Pick as many as you like.</Text>
      <View style={styles.wrap}>{REASONS.map((r) => <Pill key={r} label={r} on={reasons.includes(r)} onPress={() => toggle(reasons, setReasons, r)} />)}</View>
      <Text style={[styles.title, { marginTop: 24 }]}>What's hardest for you?</Text>
      <View style={styles.wrap}>{CHALLENGES.map((r) => <Pill key={r} label={r} on={challenges.includes(r)} onPress={() => toggle(challenges, setChallenges, r)} />)}</View>
    </View>,
    <View key="goal">
      <Text style={styles.title}>Set a daily goal</Text>
      <Text style={styles.sub}>Minutes of listening per day. Small and steady wins.</Text>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Stepper value={goal} min={5} max={60} step={5} onChange={setGoal} format={(v) => `${v} min`} />
      </View>
      <Text style={[styles.title, { marginTop: 32 }]}>Daily reminder</Text>
      <Text style={styles.sub}>We'll send one gentle nudge a day at this time.</Text>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Stepper value={hour} min={0} max={23} onChange={setHour} format={(h) => formatTime(h, 0)} />
      </View>
    </View>,
  ];

  const last = step === steps.length - 1;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.dots}>
        {steps.map((_, i) => <View key={i} style={[styles.dot, i <= step && { backgroundColor: C.accent }]} />)}
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }}>{steps[step]}</ScrollView>
      <View style={styles.footer}>
        {step > 0 && (
          <Pressable style={[styles.btn, styles.ghost]} onPress={() => setStep(step - 1)}>
            <Text style={[styles.btnText, { color: C.ink }]}>Back</Text>
          </Pressable>
        )}
        {last ? (
          <>
            <Pressable style={[styles.btn, styles.ghost]} onPress={() => finish(false)}>
              <Text style={[styles.btnText, { color: C.ink }]}>No reminder</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={() => finish(true)}>
              <Text style={styles.btnText}>Start learning</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.btn} onPress={() => setStep(step + 1)}>
            <Text style={styles.btnText}>{step === 0 ? 'Get started' : 'Continue'}</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  hero: { width: '100%', height: 260, borderRadius: 24, overflow: 'hidden', marginBottom: 8 },
  heroBubble: { position: 'absolute', top: 16, alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  heroBubbleText: { fontWeight: '800', color: C.ink, fontSize: 15 },
  logo: { fontSize: 40, fontWeight: '900', color: C.ink },
  title: { fontSize: 24, fontWeight: '800', color: C.ink, marginBottom: 6, textAlign: 'left' },
  sub: { color: C.sub, fontSize: 15, lineHeight: 21 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderColor: C.line, marginTop: 10, backgroundColor: C.card },
  optionText: { flex: 1, color: C.ink, fontSize: 15, fontWeight: '600' },
  levelTag: { color: '#fff', fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden' },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 12 },
  dot: { width: 28, height: 5, borderRadius: 3, backgroundColor: C.line },
  footer: { flexDirection: 'row', gap: 10, padding: 16 },
  btn: { flex: 1, backgroundColor: C.accent, padding: 16, borderRadius: 16, alignItems: 'center' },
  ghost: { backgroundColor: C.line },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
