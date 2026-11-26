import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, ListViewToken as ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SceneArt from '../components/SceneArt';
import Subtitle from '../components/Subtitle';
import WordSheet from '../components/WordSheet';
import { CATEGORIES, Category, Clip, CLIPS } from '../data/clips';
import { LEVELS } from '../data/dictionary';
import { success } from '../lib/haptics';
import { speakJapanese, stopSpeaking } from '../lib/speech';
import { useStore } from '../lib/store';
import { C, LEVEL_COLOR } from '../lib/theme';

type Filter = 'mine' | 'all' | Category;

function ClipCard({ clip, active, height }: { clip: Clip; active: boolean; height: number }) {
  const { state, saveWord, removeWord, addWatchSeconds, markClipWatched, updateProfile } = useStore();
  const p = state.profile;
  const [lineIdx, setLineIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [word, setWord] = useState<{ surface: string; line: number } | null>(null);
  const gen = useRef(0);

  // auto-play when the card becomes active
  useEffect(() => {
    if (active) {
      setLineIdx(0);
      setFinished(false);
      setPlaying(true);
    } else {
      setPlaying(false);
      gen.current++;
      stopSpeaking();
    }
  }, [active]);

  useEffect(() => {
    if (!playing || !active || word) return;
    const myGen = ++gen.current;
    const line = clip.lines[lineIdx];
    speakJapanese(line.jp.replace(/ /g, ''), {
      slow: p.slowAudio,
      voice: line.voice,
      onDone: () => {
        if (gen.current !== myGen) return;
        setTimeout(() => {
          if (gen.current !== myGen) return;
          if (lineIdx + 1 < clip.lines.length) setLineIdx(lineIdx + 1);
          else {
            setPlaying(false);
            setFinished(true);
            markClipWatched(clip.id);
          }
        }, 650);
      },
    });
    return () => {
      gen.current++;
      stopSpeaking();
    };
  }, [playing, active, lineIdx, word, p.slowAudio]);

  // count watch time while playing
  useEffect(() => {
    if (!playing || !active || word) return;
    const t = setInterval(() => addWatchSeconds(5), 5000);
    return () => clearInterval(t);
  }, [playing, active, word]);

  const togglePlay = () => {
    if (finished) {
      setLineIdx(0);
      setFinished(false);
      setPlaying(true);
    } else setPlaying((x) => !x);
  };

  const replayLine = (i: number) => {
    setLineIdx(i);
    setFinished(false);
    setPlaying(true);
  };

  const sel = word ? clip.lines[word.line] : undefined;
  const seen = state.watched.includes(clip.id);
  const shownLine = playing || finished ? lineIdx : -1;

  return (
    <View style={[styles.card, { height, backgroundColor: clip.color }]}>
      <View style={styles.sceneArea}>
        <SceneArt
          backdrop={clip.backdrop}
          cast={clip.cast}
          rain={clip.rain}
          speaker={playing || finished ? clip.lines[lineIdx].speaker : undefined}
          talking={playing && active && !word}
        />
        {(playing || finished) && (
          <Text style={styles.speaker}>{clip.lines[lineIdx].speaker}</Text>
        )}
        <View style={styles.dots} accessibilityLabel={`Line ${Math.max(1, shownLine + 1)} of ${clip.lines.length}`}>
          {clip.lines.map((_, i) => (
            <View key={i} style={[styles.dot, i <= shownLine && styles.dotOn]} />
          ))}
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={[styles.badge, { backgroundColor: LEVEL_COLOR[clip.level] }]}>{clip.level}</Text>
        <Text style={styles.badgeGhost}>{CATEGORIES.find((c) => c.key === clip.category)?.jp}</Text>
        <Text style={styles.title} numberOfLines={1}>{clip.title}</Text>
        {seen && (
          <View style={styles.seen} accessibilityLabel="Watched">
            <Ionicons name="checkmark-circle" size={14} color="#7CE0C3" />
            <Text style={styles.seenText}>Watched</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.subs} contentContainerStyle={{ paddingBottom: 8 }}>
        {clip.lines.map((l, i) => (
          <Pressable key={i} onLongPress={() => replayLine(i)}>
            <Subtitle
              jp={l.jp}
              en={l.en}
              dark
              active={i === lineIdx && (playing || finished)}
              showFurigana={p.showFurigana}
              showRomaji={p.showRomaji}
              showEnglish={p.showEnglish}
              savedWords={state.cards}
              onTapWord={(s) => setWord({ surface: s, line: i })}
            />
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.controls}>
        <Pressable style={styles.ctrl} onPress={() => replayLine(Math.max(0, lineIdx - 1))} accessibilityLabel="Previous line">
          <Ionicons name="play-skip-back" size={20} color="#fff" />
        </Pressable>
        <Pressable style={[styles.ctrl, styles.ctrlMain]} onPress={togglePlay} accessibilityLabel={finished ? 'Replay scene' : playing ? 'Pause' : 'Play'}>
          <Ionicons name={finished ? 'refresh' : playing ? 'pause' : 'play'} size={28} color={C.ink} style={!playing && !finished ? { marginLeft: 3 } : undefined} />
        </Pressable>
        <Pressable style={styles.ctrl} onPress={() => replayLine(lineIdx)} accessibilityLabel="Repeat line">
          <Ionicons name="repeat" size={22} color="#fff" />
        </Pressable>
        <Pressable
          style={[styles.ctrl, p.slowAudio && styles.ctrlOn]}
          onPress={() => updateProfile({ slowAudio: !p.slowAudio })}
          accessibilityLabel="Toggle slow audio"
          accessibilityState={{ selected: p.slowAudio }}
        >
          <Text style={[styles.ctrlText, p.slowAudio && { color: C.ink }]}>0.7×</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>Tap a word to look it up · long-press a line to replay it · swipe up for the next scene</Text>

      <WordSheet
        word={word?.surface ?? null}
        saved={!!(word && state.cards[word.surface])}
        context={sel ? { jp: sel.jp, en: sel.en } : undefined}
        onSave={() => {
          if (!word || !sel) return;
          success();
          saveWord(word.surface, clip.id, sel.jp, sel.en);
        }}
        onRemove={() => word && removeWord(word.surface)}
        onClose={() => setWord(null)}
      />
    </View>
  );
}

export default function FeedScreen() {
  const { state } = useStore();
  const [filter, setFilter] = useState<Filter>('mine');
  const [height, setHeight] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  const clips = useMemo(() => {
    const myLevel = LEVELS.indexOf(state.profile.level);
    let list = CLIPS;
    if (filter === 'mine') list = CLIPS.filter((c) => Math.abs(LEVELS.indexOf(c.level) - myLevel) <= 1);
    else if (filter !== 'all') list = CLIPS.filter((c) => c.category === filter);
    // put the learner's own level first, then nearest levels; unwatched first
    return [...list].sort((a, b) => {
      const da = Math.abs(LEVELS.indexOf(a.level) - myLevel);
      const db = Math.abs(LEVELS.indexOf(b.level) - myLevel);
      if (da !== db) return da - db;
      return Number(state.watched.includes(a.id)) - Number(state.watched.includes(b.id));
    });
    // only re-sort when the filter or level changes, not on every watch
  }, [filter, state.profile.level]);

  useEffect(() => setActiveId(clips[0]?.id ?? null), [clips]);

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable);
    if (first) setActiveId((first.item as Clip).id);
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: Clip }) => <ClipCard clip={item} active={item.id === activeId} height={height} />,
    [activeId, height],
  );

  const chips: { key: Filter; label: string }[] = [
    { key: 'mine', label: `My level (${state.profile.level})` },
    { key: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ key: c.key as Filter, label: `${c.jp} ${c.label}` })),
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>mimi<Text style={{ color: C.accent }}>耳</Text></Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingRight: 12 }}>
          {chips.map((c) => (
            <Pressable key={c.key} onPress={() => setFilter(c.key)} style={[styles.chip, filter === c.key && styles.chipOn]}>
              <Text style={[styles.chipText, filter === c.key && { color: C.ink }]}>{c.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={{ flex: 1 }} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
        {height > 0 && (
          <FlatList
            data={clips}
            keyExtractor={(c) => c.id}
            renderItem={renderItem}
            pagingEnabled
            snapToInterval={height}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewable}
            viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
            getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
            extraData={activeId}
            ListEmptyComponent={<Text style={{ color: '#fff', padding: 24 }}>No scenes match this filter yet.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.feedBg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 10 },
  logo: { color: '#fff', fontSize: 22, fontWeight: '800', flexShrink: 0 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  chipOn: { backgroundColor: '#fff' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  card: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  sceneArea: { flex: 1, minHeight: 150, marginBottom: 10 },
  speaker: { position: 'absolute', top: 10, left: 10, color: '#fff', fontSize: 13, fontWeight: '800', backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  badge: { color: '#fff', fontWeight: '800', fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' },
  badgeGhost: { color: '#fff', fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  title: { color: '#fff', fontWeight: '700', fontSize: 16, flex: 1 },
  subs: { flexGrow: 0, maxHeight: '46%' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 8 },
  ctrl: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  ctrlMain: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
  ctrlOn: { backgroundColor: '#fff' },
  ctrlText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  dots: { position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  dot: { width: 14, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotOn: { backgroundColor: '#fff' },
  seen: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seenText: { color: '#7CE0C3', fontSize: 11, fontWeight: '700' },
  hint: { color: 'rgba(255,255,255,0.55)', fontSize: 11, textAlign: 'center', marginTop: 8 },
});
