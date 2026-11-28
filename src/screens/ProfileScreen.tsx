import React, { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, Stepper, Toggle } from '../components/Choice';
import { LEVELS } from '../data/dictionary';
import { cancelDailyReminder, scheduleDailyReminder } from '../lib/notifications';
import { useStore } from '../lib/store';
import { C, LEVEL_COLOR } from '../lib/theme';

export function formatTime(h: number, m: number) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const PRIVACY_URL = 'https://github.com/aditya22314/gomu-clone/blob/main/docs/privacy-policy.md';

export default function ProfileScreen() {
  const { state, updateProfile, resetAll, exportData, importData } = useStore();
  const p = state.profile;
  const [backupText, setBackupText] = useState<string | null>(null);
  const [backupNote, setBackupNote] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [pasted, setPasted] = useState('');

  const doExport = async () => {
    const data = exportData();
    if (Platform.OS === 'web') {
      setBackupText(data);
      try {
        await navigator.clipboard.writeText(data);
        setBackupNote('Backup copied. Paste it somewhere safe, like a note or an email to yourself.');
      } catch {
        setBackupNote('Select the text below and copy it somewhere safe.');
      }
      return;
    }
    try {
      await Share.share({ message: data, title: 'Mimi backup' });
    } catch {
      setBackupText(data);
      setBackupNote('Select the text below and copy it somewhere safe.');
    }
  };

  const doImport = () => {
    const res = importData(pasted);
    if (res.ok) {
      setBackupNote(`Restored ${res.words} word${res.words === 1 ? '' : 's'} and your progress.`);
      setRestoring(false);
      setPasted('');
    } else setBackupNote(res.error);
  };
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
      setNote(Platform.OS === 'web' ? 'Reminders work in the phone app, not the web preview.' : "Couldn't set a reminder. Check that notifications are on for Mimi (they don't work inside Expo Go on Android).");
      updateProfile({ reminderOn: false });
    } else setNote(`Reminder set for ${formatTime(hour, minute)} every day.`);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Text style={styles.h1}>Profile</Text>

        <View style={styles.box}>
          <Text style={styles.h3}>Your level</Text>
          <Text style={styles.sub}>The Scenes tab shows scenes at and around this level.</Text>
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
          <Toggle label="Daily reminder" hint="One notification a day, nothing else." value={p.reminderOn} onChange={(v) => void setReminder(v)} />
          {p.reminderOn && (
            <View style={{ gap: 8 }}>
              <Text style={styles.sub}>Hour</Text>
              <Stepper value={p.reminderHour} min={0} max={23} onChange={(h) => void setReminder(true, h, p.reminderMinute)} format={(h) => formatTime(h, p.reminderMinute)} />
              <Text style={styles.sub}>Minute</Text>
              <Stepper value={p.reminderMinute} min={0} max={45} step={15} onChange={(m) => void setReminder(true, p.reminderHour, m)} format={(m) => `:${String(m).padStart(2, '0')}`} />
            </View>
          )}
          {!!note && <Text style={[styles.sub, { marginTop: 6 }]}>{note}</Text>}
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
          <Text style={styles.h3}>Backup</Text>
          <Text style={styles.sub}>
            Mimi has no account, so your words live only on this device. Make a backup before you switch phones, then paste it in on the
            new one.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={[styles.action, { flex: 1 }]} onPress={() => void doExport()}>
              <Text style={styles.actionText}>Back up my data</Text>
            </Pressable>
            <Pressable style={[styles.action, styles.actionGhost, { flex: 1 }]} onPress={() => { setRestoring((r) => !r); setBackupNote(null); }}>
              <Text style={[styles.actionText, { color: C.ink }]}>{restoring ? 'Cancel' : 'Restore'}</Text>
            </Pressable>
          </View>
          {!!backupText && !restoring && (
            <TextInput style={styles.backupBox} value={backupText} multiline editable={false} selectTextOnFocus numberOfLines={4} />
          )}
          {restoring && (
            <View>
              <TextInput
                style={styles.backupBox}
                value={pasted}
                onChangeText={setPasted}
                multiline
                placeholder="Paste your backup here"
                placeholderTextColor={C.sub}
                autoCapitalize="none"
                autoCorrect={false}
                nativeID="restore-input"
              />
              <Text style={[styles.sub, { marginTop: 6 }]}>Restoring replaces everything currently on this device.</Text>
              <Pressable style={[styles.action, !pasted.trim() && { opacity: 0.5 }]} disabled={!pasted.trim()} onPress={doImport}>
                <Text style={styles.actionText}>Restore from backup</Text>
              </Pressable>
            </View>
          )}
          {!!backupNote && <Text style={[styles.sub, { marginTop: 8, color: C.ink }]}>{backupNote}</Text>}
        </View>

        <View style={styles.box}>
          <Text style={styles.h3}>About Mimi</Text>
          <Text style={styles.sub}>
            Free, no ads, no account, no tracking. Everything you do stays on this device. Scenes are original dialogues voiced by
            your phone's built-in Japanese voice. Clips play in YouTube's own player, credited to their channels, and their
            subtitles come from YouTube's captions. Word lookups use JMdict (EDRDG, CC BY-SA 4.0) via Jisho.org.
          </Text>
          <Text
            style={[styles.sub, { color: C.accent, marginTop: 6 }]}
            accessibilityRole="link"
            onPress={() => Linking.openURL(PRIVACY_URL)}
          >
            Privacy policy
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
  action: { marginTop: 12, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: C.accent },
  actionGhost: { backgroundColor: C.line },
  actionText: { color: '#fff', fontWeight: '800' },
  backupBox: { marginTop: 10, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 10, minHeight: 90, maxHeight: 160, fontSize: 12, color: C.ink, backgroundColor: C.bg, textAlignVertical: 'top' },
  danger: { marginTop: 12, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#FDE2E2' },
  dangerText: { color: C.danger, fontWeight: '800' },
});
