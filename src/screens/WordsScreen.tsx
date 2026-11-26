import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WordSheet from '../components/WordSheet';
import { CLIPS } from '../data/clips';
import { joinTokens, Level, LEVELS, lookup } from '../data/dictionary';
import { success, tap, warning } from '../lib/haptics';
import { toRomaji } from '../lib/romaji';
import { speakJapanese } from '../lib/speech';
import { Card, describeDue, formatGap, Grade, isDue, isMastered, schedule } from '../lib/srs';
import { useStore } from '../lib/store';
import { C, LEVEL_COLOR } from '../lib/theme';

function ReviewSession({ queue: initial, onExit }: { queue: string[]; onExit: () => void }) {
  const { state, review } = useStore();
  const [queue, setQueue] = useState(initial);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [missed, setMissed] = useState(0);

  const word = queue[idx];
  const card = word ? state.cards[word] : undefined;
  const e = word ? lookup(word) : undefined;

  if (!card || !e) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 56 }}>🎉</Text>
        <Text style={styles.h2}>All caught up</Text>
        <Text style={[styles.sub, { textAlign: 'center' }]}>
          You did {done} review{done === 1 ? '' : 's'}
          {missed > 0 ? `, and went over ${missed} tricky word${missed === 1 ? '' : 's'} again` : ''}. Each word comes back right before you'd
          forget it.
        </Text>
        <Pressable style={styles.primary} onPress={onExit}>
          <Text style={styles.primaryText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  const grade = (g: Grade) => {
    review(word, g);
    setDone((d) => d + 1);
    if (g === 'again') {
      // show a missed word once more at the end of this session
      warning();
      setMissed((m) => m + 1);
      if (!queue.slice(idx + 1).includes(word)) setQueue((q) => [...q, word]);
    } else tap();
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  const clip = CLIPS.find((c) => c.id === card.clipId);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.rowBetween}>
        <Pressable onPress={onExit} accessibilityLabel="Close review" hitSlop={10}>
          <Ionicons name="close" size={26} color={C.ink} />
        </Pressable>
        <Text style={styles.sub}>{idx + 1} / {queue.length}</Text>
      </View>
      <View style={styles.progress}><View style={[styles.progressFill, { width: `${(idx / queue.length) * 100}%` }]} /></View>
      <Pressable style={styles.flash} onPress={() => setRevealed(true)}>
        <Text style={[styles.levelTag, { backgroundColor: LEVEL_COLOR[e.level] }]}>{e.level}</Text>
        {revealed && <Text style={styles.sub}>{e.reading} · {toRomaji(e.reading, e.pos === 'particle')}</Text>}
        <Text style={styles.flashWord}>{e.surface}</Text>
        {revealed ? (
          <>
            <Text style={styles.flashMeaning}>{e.meaning}</Text>
            <View style={styles.ctx}>
              <Text style={{ color: C.ink, fontSize: 15 }}>{joinTokens(card.lineJp)}</Text>
              <Text style={styles.sub}>{card.lineEn}</Text>
              {clip && <Text style={[styles.sub, { marginTop: 4 }]}>Heard in “{clip.title}”</Text>}
            </View>
          </>
        ) : (
          <Text style={[styles.sub, { marginTop: 24 }]}>Do you remember it? Tap to reveal.</Text>
        )}
        <Pressable onPress={() => speakJapanese(e.surface)} style={styles.speakBtn} accessibilityLabel="Play pronunciation">
          <Ionicons name="volume-high" size={22} color={C.accent} />
        </Pressable>
      </Pressable>
      {revealed && (
        <View style={styles.grades}>
          {([
            ['again', 'Again', C.danger],
            ['hard', 'Hard', '#F08C00'],
            ['good', 'Good', C.teal],
            ['easy', 'Easy', '#3D8BFD'],
          ] as [Grade, string, string][]).map(([g, label, color]) => (
            <Pressable key={g} style={[styles.gradeBtn, { backgroundColor: color }]} onPress={() => grade(g)} accessibilityLabel={`${label}, see it again in ${formatGap(schedule(card, g))}`}>
              <Text style={styles.primaryText}>{label}</Text>
              <Text style={styles.gradeGap}>{formatGap(schedule(card, g))}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function WordsScreen() {
  const { state, removeWord, saveWord } = useStore();
  const [reviewing, setReviewing] = useState<string[] | null>(null);
  const [open, setOpen] = useState<Card | null>(null);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<Level | 'all'>('all');

  const cards = useMemo(() => Object.values(state.cards).sort((a, b) => a.due - b.due), [state.cards]);
  const due = cards.filter((c) => isDue(c));
  const mastered = cards.filter(isMastered).length;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      const e = lookup(c.word);
      if (level !== 'all' && e?.level !== level) return false;
      if (!q) return true;
      return [c.word, e?.reading, e?.meaning, e && toRomaji(e.reading)].some((f) => f?.toLowerCase().includes(q));
    });
  }, [cards, query, level]);

  if (reviewing) {
    return (
      <SafeAreaView style={styles.root}>
        <ReviewSession queue={reviewing} onExit={() => setReviewing(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        data={shown}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(c) => c.word}
        ListHeaderComponent={
          <View>
            <Text style={styles.h1}>Your words</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}><Text style={styles.statNum}>{due.length}</Text><Text style={styles.sub}>To review</Text></View>
              <View style={styles.stat}><Text style={styles.statNum}>{mastered}</Text><Text style={styles.sub}>Mastered</Text></View>
              <View style={styles.stat}><Text style={styles.statNum}>{cards.length}</Text><Text style={styles.sub}>Saved</Text></View>
            </View>
            <Pressable
              style={[styles.primary, due.length === 0 && { opacity: 0.5 }]}
              disabled={due.length === 0}
              onPress={() => setReviewing(due.map((c) => c.word))}
            >
              <Text style={styles.primaryText}>
                {due.length ? `Review now · ${due.length} word${due.length === 1 ? '' : 's'}` : 'Nothing to review right now'}
              </Text>
            </Pressable>
            {cards.length > 0 && (
              <Pressable style={styles.secondary} onPress={() => setReviewing(cards.map((c) => c.word))}>
                <Text style={[styles.primaryText, { color: C.ink }]}>Practice all anyway</Text>
              </Pressable>
            )}
            {cards.length > 0 && (
              <>
                <View style={styles.search}>
                  <Ionicons name="search" size={18} color={C.sub} />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search word, reading or meaning"
                    placeholderTextColor={C.sub}
                    style={styles.searchInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    nativeID="word-search"
                  />
                  {query.length > 0 && (
                    <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search" hitSlop={8}>
                      <Ionicons name="close-circle" size={18} color={C.sub} />
                    </Pressable>
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingBottom: 4 }}>
                  {(['all', ...LEVELS] as const).map((lv) => (
                    <Pressable
                      key={lv}
                      onPress={() => setLevel(lv)}
                      style={[styles.chip, level === lv && { backgroundColor: lv === 'all' ? C.ink : LEVEL_COLOR[lv], borderColor: 'transparent' }]}
                    >
                      <Text style={[styles.chipText, level === lv && { color: '#fff' }]}>{lv === 'all' ? 'All levels' : lv}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          cards.length > 0 ? (
            <View style={styles.empty}>
              <Text style={styles.sub}>No saved words match.</Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>👂</Text>
              <Text style={[styles.sub, { textAlign: 'center' }]}>Tap any word in a scene or reel to save it here.</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const e = lookup(item.word);
          return (
            <Pressable style={styles.wordRow} onPress={() => setOpen(item)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.wordText}>{item.word} <Text style={styles.sub}>{e?.reading}</Text></Text>
                <Text style={styles.sub} numberOfLines={1}>{e?.meaning}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {e && <Text style={[styles.levelTag, { backgroundColor: LEVEL_COLOR[e.level] }]}>{e.level}</Text>}
                <Text style={[styles.sub, { fontSize: 12 }]}>{isMastered(item) ? '★ Mastered · ' : ''}{describeDue(item)}</Text>
              </View>
            </Pressable>
          );
        }}
      />
      <WordSheet
        word={open?.word ?? null}
        saved={!!(open && state.cards[open.word])}
        context={open ? { jp: open.lineJp, en: open.lineEn } : undefined}
        onSave={() => {
          if (!open) return;
          success();
          saveWord(open.word, open.clipId, open.lineJp, open.lineEn);
        }}
        onRemove={() => {
          if (open) removeWord(open.word);
          setOpen(null);
        }}
        onClose={() => setOpen(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  h1: { fontSize: 28, fontWeight: '800', color: C.ink, marginBottom: 12 },
  h2: { fontSize: 22, fontWeight: '800', color: C.ink },
  sub: { color: C.sub, fontSize: 14, textAlign: 'left' },
  link: { color: C.accent, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stat: { flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.line },
  statNum: { fontSize: 26, fontWeight: '800', color: C.ink },
  primary: { backgroundColor: C.accent, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  secondary: { backgroundColor: C.line, padding: 14, borderRadius: 16, alignItems: 'center', marginTop: 8, marginBottom: 12 },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  empty: { alignItems: 'center', padding: 32, gap: 8 },
  wordRow: { flexDirection: 'row', backgroundColor: C.card, padding: 14, borderRadius: 14, marginTop: 8, borderWidth: 1, borderColor: C.line, alignItems: 'center' },
  wordText: { fontSize: 20, fontWeight: '700', color: C.ink },
  levelTag: { color: '#fff', fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: 'hidden', alignSelf: 'flex-start' },
  flash: { flex: 1, backgroundColor: C.card, borderRadius: 24, marginVertical: 16, padding: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line, gap: 6 },
  flashWord: { fontSize: 56, fontWeight: '800', color: C.ink },
  flashMeaning: { fontSize: 20, color: C.ink, textAlign: 'center' },
  ctx: { backgroundColor: C.bg, padding: 12, borderRadius: 12, marginTop: 12, alignSelf: 'stretch' },
  speakBtn: { position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  grades: { flexDirection: 'row', gap: 8 },
  gradeBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  gradeGap: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', marginTop: 2 },
  progress: { height: 6, backgroundColor: C.line, borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: C.accent },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 12, marginBottom: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: C.ink },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
  chipText: { color: C.ink, fontSize: 13, fontWeight: '700' },
});
