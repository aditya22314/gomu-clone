import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ALL_ENTRIES, Entry, hasKanji, Level, LEVELS, lookup } from '../data/dictionary';
import { speakJapanese } from '../lib/speech';
import { useStore } from '../lib/store';
import { C, LEVEL_COLOR } from '../lib/theme';

type QType = 'meaning' | 'reading' | 'listen';
type Question = { entry: Entry; type: QType; choices: string[]; answer: string };

const POOL = ALL_ENTRIES.filter((e) => e.pos !== 'symbol' && e.pos !== 'name');

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function buildQuestion(entry: Entry): Question {
  const types: QType[] = ['meaning', 'listen'];
  if (hasKanji(entry.surface)) types.push('reading');
  const type = types[Math.floor(Math.random() * types.length)];
  const field = (e: Entry) => (type === 'meaning' ? e.meaning : type === 'reading' ? e.reading : e.surface);
  const answer = field(entry);
  const candidates = shuffle(POOL.filter((e) => e.surface !== entry.surface && field(e) !== answer && (type !== 'reading' || hasKanji(e.surface))));
  // prefer distractors from the same level so the quiz isn't too easy
  const others = [...candidates.filter((e) => e.level === entry.level), ...candidates.filter((e) => e.level !== entry.level)];
  const distractors: string[] = [];
  for (const o of others) {
    const v = field(o);
    if (!distractors.includes(v)) distractors.push(v);
    if (distractors.length === 3) break;
  }
  return { entry, type, answer, choices: shuffle([answer, ...distractors]) };
}

function QuizRun({ entries, title, onFinish }: { entries: Entry[]; title: string; onFinish: (score: number) => void }) {
  const { review, state } = useStore();
  const questions = useMemo(() => shuffle(entries).slice(0, 10).map(buildQuestion), [entries]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const q = questions[i];

  if (!q) {
    const score = Math.round((correct / questions.length) * 100);
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 56 }}>{score >= 80 ? '🏅' : score >= 50 ? '👍' : '💪'}</Text>
        <Text style={styles.h2}>{correct} / {questions.length} correct</Text>
        <Text style={styles.sub}>{score >= 80 ? 'Great work!' : 'Keep watching and reviewing, you will get there.'}</Text>
        <Pressable style={styles.primary} onPress={() => onFinish(score)}>
          <Text style={styles.primaryText}>Finish</Text>
        </Pressable>
      </View>
    );
  }

  const choose = (c: string) => {
    if (picked) return;
    setPicked(c);
    const ok = c === q.answer;
    if (ok) setCorrect((x) => x + 1);
    if (state.cards[q.entry.surface]) review(q.entry.surface, ok ? 'good' : 'again');
  };

  const prompt =
    q.type === 'meaning' ? 'What does this mean?' : q.type === 'reading' ? 'How do you read this?' : 'Which word did you hear?';

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.rowBetween}>
        <Text style={styles.sub}>{title}</Text>
        <Text style={styles.sub}>{i + 1} / {questions.length}</Text>
      </View>
      <View style={styles.progress}><View style={[styles.progressFill, { width: `${(i / questions.length) * 100}%` }]} /></View>
      <Text style={styles.prompt}>{prompt}</Text>
      <View style={styles.qCard}>
        {q.type === 'listen' ? (
          <Pressable onPress={() => speakJapanese(q.entry.surface)} style={styles.listenBtn}>
            <Text style={{ fontSize: 40 }}>🔊</Text>
            <Text style={styles.sub}>Tap to play</Text>
          </Pressable>
        ) : (
          <Text style={styles.qWord}>{q.entry.surface}</Text>
        )}
      </View>
      {q.choices.map((c) => {
        const isAns = c === q.answer;
        const bg = !picked ? C.card : isAns ? C.tealSoft : c === picked ? '#FDE2E2' : C.card;
        return (
          <Pressable key={c} testID="choice" style={[styles.choice, { backgroundColor: bg }]} onPress={() => choose(c)}>
            <Text style={[styles.choiceText, q.type !== 'meaning' && { fontSize: 22 }]}>{c}</Text>
          </Pressable>
        );
      })}
      {picked && (
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.h2, { color: picked === q.answer ? C.teal : C.danger }]}>
            {picked === q.answer ? 'Correct!' : 'Not quite'}
          </Text>
          <Text style={styles.sub}>{q.entry.surface} ({q.entry.reading}): {q.entry.meaning}</Text>
          <Pressable
            style={styles.primary}
            onPress={() => {
              setPicked(null);
              setI(i + 1);
            }}
          >
            <Text style={styles.primaryText}>Next</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

export default function QuizScreen() {
  const { state, recordLevelQuiz, updateProfile } = useStore();
  const [run, setRun] = useState<{ entries: Entry[]; title: string; level?: Level } | null>(null);
  const [lastResult, setLastResult] = useState<{ level: Level; score: number } | null>(null);
  const saved = Object.keys(state.cards).map((w) => lookup(w)).filter(Boolean) as Entry[];

  if (run) {
    return (
      <SafeAreaView style={styles.root}>
        <QuizRun
          entries={run.entries}
          title={run.title}
          onFinish={(score) => {
            if (run.level) {
              recordLevelQuiz(run.level, score);
              setLastResult({ level: run.level, score });
            }
            setRun(null);
          }}
        />
      </SafeAreaView>
    );
  }

  const myIdx = LEVELS.indexOf(state.profile.level);
  const nextLevel = myIdx < LEVELS.length - 1 ? LEVELS[myIdx + 1] : null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.h1}>Quiz</Text>

        <View style={styles.box}>
          <Text style={styles.h3}>Your saved words</Text>
          <Text style={styles.sub}>Meaning, reading and listening questions. Answers also update your review schedule.</Text>
          <Pressable
            style={[styles.primary, saved.length < 1 && { opacity: 0.5 }]}
            disabled={saved.length < 1}
            onPress={() => setRun({ entries: saved, title: 'Saved words' })}
          >
            <Text style={styles.primaryText}>{saved.length ? `Start · ${Math.min(10, saved.length)} questions` : 'Save some words first'}</Text>
          </Pressable>
        </View>

        {lastResult && lastResult.score >= 80 && nextLevel && lastResult.level === state.profile.level && (
          <View style={[styles.box, { backgroundColor: C.tealSoft }]}>
            <Text style={styles.h3}>You passed {lastResult.level}! 🎉</Text>
            <Text style={styles.sub}>Ready to move up to {nextLevel}?</Text>
            <Pressable style={[styles.primary, { backgroundColor: C.teal }]} onPress={() => { updateProfile({ level: nextLevel }); setLastResult(null); }}>
              <Text style={styles.primaryText}>Switch to {nextLevel}</Text>
            </Pressable>
          </View>
        )}

        <Text style={[styles.h3, { marginTop: 12 }]}>Level quizzes</Text>
        <Text style={styles.sub}>Score 80% or more to show you're ready for the next level.</Text>
        {LEVELS.map((lv) => {
          const best = state.levelQuiz[lv];
          const pool = POOL.filter((e) => e.level === lv);
          return (
            <Pressable key={lv} style={styles.levelRow} onPress={() => setRun({ entries: pool, title: `${lv} level quiz`, level: lv })}>
              <Text style={[styles.levelTag, { backgroundColor: LEVEL_COLOR[lv] }]}>{lv}</Text>
              <Text style={{ flex: 1, color: C.ink, fontWeight: '600' }}>{pool.length} words in the pool</Text>
              <Text style={styles.sub}>{best != null ? `Best ${best}%${best >= 80 ? ' ✓' : ''}` : 'Not taken'}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  h1: { fontSize: 28, fontWeight: '800', color: C.ink, marginBottom: 12 },
  h2: { fontSize: 22, fontWeight: '800', color: C.ink },
  h3: { fontSize: 18, fontWeight: '800', color: C.ink, marginBottom: 4 },
  sub: { color: C.sub, fontSize: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  box: { backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.line, marginBottom: 12 },
  primary: { backgroundColor: C.accent, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 12, alignSelf: 'stretch' },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  progress: { height: 6, backgroundColor: C.line, borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: C.accent },
  prompt: { fontSize: 18, fontWeight: '700', color: C.ink, marginTop: 20 },
  qCard: { backgroundColor: C.card, borderRadius: 20, padding: 28, alignItems: 'center', marginVertical: 14, borderWidth: 1, borderColor: C.line },
  qWord: { fontSize: 48, fontWeight: '800', color: C.ink },
  listenBtn: { alignItems: 'center' },
  choice: { padding: 16, borderRadius: 14, borderWidth: 1, borderColor: C.line, marginBottom: 8 },
  choiceText: { fontSize: 16, color: C.ink, fontWeight: '600' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, padding: 14, borderRadius: 14, marginTop: 8, borderWidth: 1, borderColor: C.line },
  levelTag: { color: '#fff', fontSize: 12, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' },
});
