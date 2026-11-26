import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, Stepper, Toggle } from '../components/Choice';
import { LEVELS } from '../data/dictionary';
import { cancelDailyReminder, scheduleDailyReminder } from '../lib/notifications';
import { useStore } from '../lib/store';
import { C, LEVEL_COLOR } from '../lib/theme';

export function formatTime(h: number, m: number) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function ProfileScreen() {
  const { state, updateProfile, resetAll } = useStore();
  const p = state.profile;
  const [confirmStep, setConfirmStep] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const setReminder = async (on: boolean, hour = p.reminderHour, minute = p.reminderMinute) => {
    updateProfile({ reminderOn: on, reminderHour: hour, reminderMinute: minute });
    if (!on) {
      await cancelDailyReminder();
      setNote(null);
      return;
    }
    const ok = await scheduleDailyReminder(hour, minute);
    if (!ok) {
      setNote(Platform.OS === 'web' ? 'Reminders work in the phone app, not the web preview.' : 'Notifications are turned off for Mimi in your phone settings.');
      updateProfile({ reminderOn: false });
    } else setNote(`Reminder set for ${formatTime(hour, minute)} every day.`);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Text style={styles.h1}>Profile</Text>

        <View style={styles.box}>
          <Text style={styles.h3}>Your level</Text>
          <Text style={styles.sub}>The Watch tab shows scenes at and around this level.</Text>
          <View style={styles.wrap}>
            {LEVELS.map((lv) => (
              <Pill key={lv} label={lv} on={p.level === lv} color={LEVEL_COLOR[lv]} onPress={() => updateProfile({ level: lv })} />
            ))}
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.h3}>Daily goal</Text>
          <Stepper value={p.dailyGoalMin} min={5} max={60} step={5} onChange={(v) => updateProfile({ dailyGoalMin: v })} format={(v) => `${v} min`} />
        </View>

        <View style={styles.box}>
          <Toggle label="Daily reminder" hint="One notification a day, nothing else." value={p.reminderOn} onChange={(v) => setReminder(v)} />
          {p.reminderOn && (
            <View style={{ gap: 8 }}>
              <Text style={styles.sub}>Hour</Text>
              <Stepper value={p.reminderHour} min={0} max={23} onChange={(h) => setReminder(true, h, p.reminderMinute)} format={(h) => formatTime(h, p.reminderMinute)} />
              <Text style={styles.sub}>Minute</Text>
              <Stepper value={p.reminderMinute} min={0} max={45} step={15} onChange={(m) => setReminder(true, p.reminderHour, m)} format={(m) => `:${String(m).padStart(2, '0')}`} />
            </View>
          )}
          {note && <Text style={[styles.sub, { marginTop: 6 }]}>{note}</Text>}
        </View>

        <View style={styles.box}>
          <Text style={styles.h3}>Subtitles</Text>
          <Toggle label="Furigana" hint="Readings above kanji" value={p.showFurigana} onChange={(v) => updateProfile({ showFurigana: v })} />
          <Toggle label="Romaji" value={p.showRomaji} onChange={(v) => updateProfile({ showRomaji: v })} />
          <Toggle label="English" value={p.showEnglish} onChange={(v) => updateProfile({ showEnglish: v })} />
          <Toggle label="Slow audio" value={p.slowAudio} onChange={(v) => updateProfile({ slowAudio: v })} />
        </View>

        {(p.reasons.length > 0 || p.challenges.length > 0) && (
          <View style={styles.box}>
            <Text style={styles.h3}>About you</Text>
            {p.reasons.length > 0 && <Text style={styles.sub}>Learning for: {p.reasons.join(', ')}</Text>}
            {p.challenges.length > 0 && <Text style={styles.sub}>Working on: {p.challenges.join(', ')}</Text>}
          </View>
        )}

        <View style={styles.box}>
          <Text style={styles.h3}>About Mimi</Text>
          <Text style={styles.sub}>
            Free, no ads, no account, no tracking. Everything you do stays on this device. Scenes are original dialogues voiced by
            your phone's built-in Japanese voice. Dictionary links open Jisho.org.
          </Text>
        </View>

        <View style={[styles.box, { borderColor: '#F5C2C2' }]}>
          <Text style={[styles.h3, { color: C.danger }]}>Danger zone</Text>
          <Text style={styles.sub}>Delete all your words, progress and settings from this device. This can't be undone.</Text>
          {confirmStep === 0 && (
            <Pressable style={styles.danger} onPress={() => setConfirmStep(1)}>
              <Text style={styles.dangerText}>Delete all my data</Text>
            </Pressable>
          )}
          {confirmStep === 1 && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable style={[styles.danger, { flex: 1, backgroundColor: C.line }]} onPress={() => setConfirmStep(0)}>
                <Text style={[styles.dangerText, { color: C.ink }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.danger, { flex: 1, backgroundColor: C.danger }]}
                onPress={async () => {
                  await cancelDailyReminder();
                  await resetAll();
                  setConfirmStep(0);
                }}
              >
                <Text style={[styles.dangerText, { color: '#fff' }]}>Yes, delete everything</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  h1: { fontSize: 28, fontWeight: '800', color: C.ink, marginBottom: 12 },
  h3: { fontSize: 17, fontWeight: '800', color: C.ink, marginBottom: 6 },
  sub: { color: C.sub, fontSize: 13, lineHeight: 19 },
  box: { backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.line, marginBottom: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  danger: { marginTop: 12, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#FDE2E2' },
  dangerText: { color: C.danger, fontWeight: '800' },
});
