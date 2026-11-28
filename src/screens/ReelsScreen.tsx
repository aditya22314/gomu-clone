import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  ListViewToken as ViewToken,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer, { getYoutubeMeta, YoutubeIframeRef } from '../components/YouTubeView';
import WordSheet from '../components/WordSheet';
import { hasKanji } from '../data/dictionary';
import { Show, SHOWS, ShowWord, showById } from '../data/officialClips';
import { parseYouTubeId, Reel, ReelLine, ReelToken, REELS } from '../data/reels';
import { toRomaji } from '../lib/romaji';
import { useStore } from '../lib/store';
import { CaptionStatus, useCaptionLines } from '../lib/useCaptions';
import { C, LEVEL_COLOR } from '../lib/theme';

type Tapped = {
  surface: string;
  hint?: { reading?: string; base?: string; pos?: string; meaning?: string; level?: ShowWord['lv'] };
  context: { jp: string; en: string };
};

// The line being spoken at `now`: the latest one that has started. Auto-generated captions
// overlap (each line stays up until the next one ends), so the first match would lag behind.
export function lineAt(lines: ReelLine[], now: number): number {
  for (let i = lines.length - 1; i >= 0; i--) if (lines[i].start <= now) return now < lines[i].end + 2 ? i : -1;
  return -1;
}

const CAPTION_HINT: Record<CaptionStatus, string> = {
  loading: 'Loading subtitles…',
  ready: 'Subtitles appear here as the video plays. Tap any word to look it up.',
  none: 'This video has no Japanese subtitles to tap. Listen closely and look up what you hear.',
  error: "Couldn't load subtitles right now. Japanese captions show in the player when YouTube has them.",
};

function lineText(l: ReelLine) {
  return l.tokens.map((t) => t.s).join('');
}

function ReelSubtitle({
  line,
  saved,
  showFurigana,
  showRomaji,
  onTap,
}: {
  line: ReelLine;
  saved: Record<string, unknown>;
  showFurigana: boolean;
  showRomaji: boolean;
  onTap: (t: ReelToken) => void;
}) {
  return (
    <View>
      <View style={styles.subRow}>
        {line.tokens.map((t, i) => {
          const word = !!t.p && !/symbol|記号/.test(t.p);
          if (!word)
            return (
              <Text key={i} style={styles.subJp}>
                {t.s}
              </Text>
            );
          return (
            <Pressable key={i} onPress={() => onTap(t)} style={styles.subToken} accessibilityRole="button" accessibilityLabel={t.s}>
              {showFurigana && <Text style={styles.subFuri}>{hasKanji(t.s) && t.r ? t.r : ' '}</Text>}
              <Text style={[styles.subJp, styles.tappable, saved[t.s] ? { color: '#FFB199' } : null]}>{t.s}</Text>
            </Pressable>
          );
        })}
      </View>
      {showRomaji && line.tokens.every((t) => t.r || !hasKanji(t.s)) && <Text style={styles.subRomaji}>{line.tokens.map((t) => toRomaji(t.r ?? t.s, t.p === 'particle' || t.p === '助詞')).join(' ')}</Text>}
      {line.en && <Text style={styles.subEn}>{line.en}</Text>}
    </View>
  );
}

function LookupBox({ onLookup }: { onLookup: (word: string) => void }) {
  const [q, setQ] = useState('');
  const go = () => q.trim() && onLookup(q.trim());
  return (
    <View style={styles.lookup}>
      <Text style={styles.lookupLabel}>Heard a word? Look it up and save it with this video.</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          id="reel-lookup"
          value={q}
          onChangeText={setQ}
          onSubmitEditing={go}
          placeholder="例: 大丈夫, たべる, arigatou"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Pressable style={styles.lookupBtn} onPress={go} accessibilityLabel="Look up word">
          <Text style={{ color: '#fff', fontWeight: '800' }}>Look up</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ShowWords({ showId, saved, onTap }: { showId?: string; saved: Record<string, unknown>; onTap: (w: ShowWord) => void }) {
  const show = showById(showId);
  if (!show) return null;
  return (
    <View style={styles.words}>
      <Text style={styles.wordsLabel}>Words you'll hear in {show.name}</Text>
      <View style={styles.wordsRow}>
        {show.words.map((w) => (
          <Pressable
            key={w.w}
            onPress={() => onTap(w)}
            style={[styles.wordChip, saved[w.w] ? styles.wordChipSaved : null]}
            accessibilityRole="button"
            accessibilityLabel={`${w.w}, ${w.en}`}
          >
            <Text style={styles.wordJp}>{w.w}</Text>
            <Text style={styles.wordEn} numberOfLines={1}>
              {w.en}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// The browser version can't embed YouTube, so it shows the clip's show and title (and the
// YouTube thumbnail where images from YouTube are allowed) with a link to watch it there.
function Thumb({ videoId, show, title, height, onPress }: { videoId: string; show?: Show; title: string; height: number; onPress: () => void }) {
  const label = 'Plays inside the phone app. Tap to watch on YouTube.';
  return (
    <Pressable style={[styles.webPlayer, { height, backgroundColor: show?.color ?? '#000' }]} onPress={onPress} accessibilityRole="link" accessibilityLabel={label}>
      {show && <Text style={styles.thumbJp}>{show.jp}</Text>}
      {show && <Text style={styles.thumbTitle} numberOfLines={1}>{title}</Text>}
      <Image source={{ uri: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={styles.thumbShade} />
      <View style={styles.playDot}>
        <Text style={{ color: '#fff', fontSize: 22, marginLeft: 3 }}>▶</Text>
      </View>
      <Text style={styles.webPlayerText}>{label}</Text>
    </Pressable>
  );
}

function ReelCard({ reel, active, height, onRemove, onNext }: { reel: Reel; active: boolean; height: number; onRemove?: () => void; onNext?: () => void }) {
  const { state, saveWord, removeWord, addWatchSeconds } = useStore();
  const { width } = useWindowDimensions();
  const p = state.profile;
  const player = useRef<YoutubeIframeRef>(null);
  const [playing, setPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const [tapped, setTapped] = useState<Tapped | null>(null);
  const [failed, setFailed] = useState(false);
  const show = showById(reel.show);
  const { lines, status } = useCaptionLines(reel.videoId, reel.lines, active);
  const openOnYouTube = () => {
    void Linking.openURL(`https://www.youtube.com/watch?v=${reel.videoId}`);
  };
  const playerW = Math.min(width, 440) - 24;
  const playerH = Math.round((playerW * 9) / 16);

  useEffect(() => setPlaying(active), [active]);

  // follow the video with the subtitles
  useEffect(() => {
    if (!active || !playing || !lines?.length) return;
    const t = setInterval(() => {
      void (async () => {
        const now = (await player.current?.getCurrentTime().catch(() => 0)) ?? 0;
        const i = lineAt(lines, now);
        setLineIdx(i);
      })();
    }, 250);
    return () => clearInterval(t);
  }, [active, playing, lines]);

  useEffect(() => {
    if (!active || !playing) return;
    const t = setInterval(() => addWatchSeconds(5), 5000);
    return () => clearInterval(t);
  }, [active, playing]);

  const line = lines && lineIdx >= 0 ? lines[lineIdx] : undefined;
  const context = (l?: ReelLine) => ({ jp: l ? lineText(l) : reel.title, en: `From “${reel.title}” · ${reel.channel} on YouTube` });

  const playerView = () => {
    if (Platform.OS === 'web') {
      return <Thumb videoId={reel.videoId} show={show} title={reel.title} height={playerH} onPress={openOnYouTube} />;
    }
    if (failed) {
      return (
        <View style={[styles.webPlayer, { height: playerH }]}>
          <Text style={styles.failTitle}>This clip can't play here</Text>
          <Text style={styles.webPlayerText}>The channel may limit it to YouTube or to some countries.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
            <Pressable style={styles.failBtn} onPress={openOnYouTube}>
              <Text style={styles.failBtnText}>Open on YouTube</Text>
            </Pressable>
            {onNext && (
              <Pressable style={[styles.failBtn, { backgroundColor: C.accent }]} onPress={onNext}>
                <Text style={styles.failBtnText}>Next clip</Text>
              </Pressable>
            )}
          </View>
        </View>
      );
    }
    return (
      <View style={styles.playerWrap}>
        <YoutubePlayer
          ref={player}
          height={playerH}
          width={playerW}
          videoId={reel.videoId}
          play={playing && !tapped}
          onError={() => setFailed(true)}
          onChangeState={(s: string) => {
            if (s === 'playing') setPlaying(true);
            if (s === 'paused') setPlaying(false);
          }}
          initialPlayerParams={{
            cc_lang_pref: 'ja',
            showClosedCaptions: !reel.lines?.length,
            start: reel.start,
            end: reel.end,
            rel: false,
            modestbranding: true,
          }}
        />
      </View>
    );
  };

  return (
    <View style={[styles.card, { height }]}>
      {playerView()}

      <View style={styles.metaRow}>
        <Text style={[styles.badge, { backgroundColor: LEVEL_COLOR[reel.level] }]}>{reel.level === 'Other' ? 'Your video' : reel.level}</Text>
        <View style={{ flex: 1 }}>
          {show && (
            <Text style={[styles.showTag, { color: show.color }]}>
              {show.name} · {show.jp}
            </Text>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {reel.title}
          </Text>
          <Pressable onPress={openOnYouTube}>
            <Text style={styles.channel}>▶ {show ? `Official clip from ${reel.channel}` : reel.channel} · YouTube</Text>
          </Pressable>
        </View>
        {onRemove && (
          <Pressable onPress={onRemove} style={styles.removeBtn} accessibilityLabel="Remove video">
            <Text style={{ color: '#fff' }}>✕</Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 12 }} keyboardShouldPersistTaps="handled">
        {lines?.length ? (
          line ? (
            <View style={styles.subBox}>
              <ReelSubtitle
                line={line}
                saved={state.cards}
                showFurigana={p.showFurigana}
                showRomaji={p.showRomaji}
                onTap={(t) => setTapped({ surface: t.s, hint: { reading: t.r, base: t.b, pos: t.p }, context: context(line) })}
              />
            </View>
          ) : (
            <Text style={styles.hint}>Subtitles appear here as the video plays. Tap any word to look it up.</Text>
          )
        ) : (
          <Text style={styles.hint}>{CAPTION_HINT[status]}</Text>
        )}
        <ShowWords
          showId={reel.show}
          saved={state.cards}
          onTap={(w) =>
            setTapped({
              surface: w.w,
              hint: { reading: w.r, meaning: w.en, level: w.lv },
              context: { jp: w.w, en: `${w.en} · from “${reel.title}”, ${show?.name ?? ''}` },
            })
          }
        />
        <LookupBox onLookup={(w) => setTapped({ surface: w, context: context(line) })} />
      </ScrollView>

      <WordSheet
        word={tapped?.surface ?? null}
        hint={tapped?.hint}
        saved={!!(tapped && state.cards[tapped.surface])}
        context={tapped?.context}
        onSave={() => tapped && saveWord(tapped.surface, `yt:${reel.videoId}`, tapped.context.jp, tapped.context.en)}
        onRemove={() => tapped && removeWord(tapped.surface)}
        onClose={() => setTapped(null)}
      />
    </View>
  );
}

function AddVideo({ onDone }: { onDone: () => void }) {
  const { addReel } = useStore();
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const add = async () => {
    const id = parseYouTubeId(url);
    if (!id) {
      setError("That doesn't look like a YouTube link. Paste a link like youtube.com/watch?v=… or youtube.com/shorts/…");
      return;
    }
    setBusy(true);
    let title = 'YouTube video';
    try {
      const meta = await getYoutubeMeta(id);
      title = meta.title || title;
    } catch {
      // keep the default title
    }
    addReel(id, title);
    setBusy(false);
    setUrl('');
    onDone();
  };
  return (
    <View style={styles.addBox}>
      <Text style={styles.addTitle}>Add a YouTube video</Text>
      <Text style={styles.addSub}>Paste any Japanese video or Short. It plays with Japanese captions, and you can look up and save words from it.</Text>
      <TextInput
        id="add-video-url"
        value={url}
        onChangeText={(t) => {
          setUrl(t);
          setError(null);
        }}
        placeholder="https://youtube.com/shorts/…"
        placeholderTextColor={C.sub}
        style={styles.addInput}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={add}
      />
      {error && <Text style={{ color: C.danger, marginTop: 6 }}>{error}</Text>}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <Pressable style={[styles.addBtn, { backgroundColor: C.line }]} onPress={onDone}>
          <Text style={{ fontWeight: '800', color: C.ink }}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.addBtn} onPress={add} disabled={busy}>
          <Text style={{ fontWeight: '800', color: '#fff' }}>{busy ? 'Adding…' : 'Add video'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ReelsScreen() {
  const { state, removeReel } = useStore();
  const [height, setHeight] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const list = useRef<FlatList<Reel & { mine?: boolean }>>(null);

  const reels = useMemo<(Reel & { mine?: boolean })[]>(
    () =>
      (
        [
          ...state.userReels.map((r) => ({ id: r.id, videoId: r.videoId, title: r.title, channel: 'Added by you', level: 'Other' as const, mine: true })),
          ...REELS,
        ] as (Reel & { mine?: boolean })[]
      ).filter((r) => filter === 'all' || (filter === 'mine' ? r.mine : r.show === filter)),
    [state.userReels, filter],
  );

  useEffect(() => setActiveId((cur) => (cur && reels.some((r) => r.id === cur) ? cur : (reels[0]?.id ?? null))), [reels]);

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable);
    if (first) setActiveId((first.item as Reel).id);
  }).current;

  const renderItem = useCallback(
    ({ item, index }: { item: Reel & { mine?: boolean }; index: number }) => (
      <ReelCard
        reel={item}
        active={item.id === activeId}
        height={height}
        onRemove={item.mine ? () => removeReel(item.videoId) : undefined}
        onNext={index < reels.length - 1 ? () => list.current?.scrollToIndex({ index: index + 1, animated: true }) : undefined}
      />
    ),
    [activeId, height, reels.length],
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <Text style={styles.logo}>Reels</Text>
          <Text style={styles.topSub}>Official anime clips</Text>
          <Pressable style={styles.addTop} onPress={() => setAdding(true)} accessibilityLabel="Add a YouTube video">
            <Text style={{ color: C.ink, fontWeight: '800' }}>＋ Add video</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsRow}>
          {[{ id: 'all', name: 'All' }, ...SHOWS, ...(state.userReels.length ? [{ id: 'mine', name: 'My videos' }] : [])].map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setFilter(s.id)}
              style={[styles.chip, filter === s.id ? styles.chipOn : null]}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === s.id }}
            >
              <Text style={[styles.chipText, filter === s.id ? styles.chipTextOn : null]}>{s.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {adding && <AddVideo onDone={() => setAdding(false)} />}
        <View style={{ flex: 1 }} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
          {height > 0 && reels.length > 0 && (
            <FlatList
              ref={list}
              key={filter}
              data={reels}
              keyExtractor={(r) => r.id}
              renderItem={renderItem}
              pagingEnabled
              snapToInterval={height}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
              onViewableItemsChanged={onViewable}
              viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
              getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
              extraData={activeId}
              keyboardShouldPersistTaps="handled"
            />
          )}
          {reels.length === 0 && !adding && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 54 }}>🎬</Text>
              <Text style={styles.emptyTitle}>Learn from real Japanese videos</Text>
              <Text style={styles.emptySub}>
                Add any YouTube video or Short in Japanese. Watch it with Japanese captions, look up the words you hear and save them to your review deck.
              </Text>
              <Pressable style={styles.addBtnBig} onPress={() => setAdding(true)}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>＋ Add your first video</Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.feedBg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  logo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  topSub: { color: 'rgba(255,255,255,0.55)', fontSize: 13, flex: 1 },
  addTop: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  card: { paddingHorizontal: 12, paddingTop: 4 },
  playerWrap: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#000', alignSelf: 'center' },
  webPlayer: { borderRadius: 16, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 8 },
  webPlayerText: { color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontSize: 13, fontWeight: '600' },
  thumbShade: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  thumbJp: { position: 'absolute', top: 14, left: 16, right: 16, color: 'rgba(255,255,255,0.95)', fontSize: 26, fontWeight: '900' },
  thumbTitle: { position: 'absolute', bottom: 14, left: 16, right: 16, color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
  playDot: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  failTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  failBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  failBtnText: { color: '#fff', fontWeight: '800' },
  showTag: { fontSize: 12, fontWeight: '800', marginBottom: 2 },
  chips: { flexGrow: 0 },
  chipsRow: { paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.1)' },
  chipOn: { backgroundColor: '#fff' },
  chipText: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 13 },
  chipTextOn: { color: C.ink },
  words: { marginTop: 16, gap: 8 },
  wordsLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wordChip: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, maxWidth: 150 },
  wordChipSaved: { borderWidth: 1, borderColor: '#FFB199' },
  wordJp: { color: '#fff', fontSize: 17, fontWeight: '700' },
  wordEn: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 12 },
  badge: { color: '#fff', fontWeight: '800', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: 'hidden', marginTop: 2 },
  title: { color: '#fff', fontWeight: '800', fontSize: 16 },
  channel: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 },
  removeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  hint: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 14 },
  subBox: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 12, marginTop: 12 },
  subRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' },
  subToken: { alignItems: 'center', marginRight: 2 },
  subFuri: { color: 'rgba(255,255,255,0.65)', fontSize: 10, lineHeight: 13 },
  subJp: { color: '#fff', fontSize: 22, fontWeight: '600' },
  tappable: { textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  subRomaji: { color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginTop: 4 },
  subEn: { color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  lookup: { marginTop: 16, gap: 8 },
  lookupLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  lookupBtn: { backgroundColor: C.accent, borderRadius: 12, paddingHorizontal: 14, justifyContent: 'center' },
  addBox: { backgroundColor: C.card, margin: 12, borderRadius: 18, padding: 16 },
  addTitle: { fontSize: 18, fontWeight: '800', color: C.ink },
  addSub: { color: C.sub, marginTop: 4, marginBottom: 10 },
  addInput: { borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, fontSize: 15, color: C.ink },
  addBtn: { flex: 1, backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  emptySub: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20 },
  addBtnBig: { backgroundColor: C.accent, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, marginTop: 8 },
});
