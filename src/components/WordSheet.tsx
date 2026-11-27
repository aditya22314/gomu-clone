import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Entry, joinTokens, lookup } from '../data/dictionary';
import { lookupOnline } from '../lib/jisho';
import { toRomaji } from '../lib/romaji';
import { speakJapanese } from '../lib/speech';
import { C, LEVEL_COLOR } from '../lib/theme';

type Props = {
  word: string | null;
  saved: boolean;
  onSave: () => void;
  onRemove: () => void;
  onClose: () => void;
  context?: { jp: string; en: string };
  // reading / dictionary form / part of speech from the subtitle tokenizer, for words not in the built-in dictionary
  // meaning/level: a meaning supplied with the word (e.g. a show's word list), used when the built-in dictionary lacks it
  hint?: { reading?: string; base?: string; pos?: string; meaning?: string; level?: Entry['level'] };
};

export default function WordSheet({ word, saved, onSave, onRemove, onClose, context, hint }: Props) {
  const [online, setOnline] = useState<{ word: string; entry: Entry | null } | null>(null);
  const given: Entry | undefined =
    word && hint?.meaning ? { surface: word, reading: hint.reading ?? word, meaning: hint.meaning, level: hint.level ?? 'Other', pos: hint.pos ?? 'word' } : undefined;
  const local = word ? lookup(word) ?? given : undefined;
  useEffect(() => {
    if (!word || local) return;
    let alive = true;
    setOnline(null);
    void lookupOnline(word, hint).then((entry) => alive && setOnline({ word, entry }));
    return () => {
      alive = false;
    };
  }, [word]);
  const fetched = online !== null && word !== null && online.word === word ? online : null;
  const e = local ?? fetched?.entry ?? undefined;
  const loading = !!word && !local && !fetched;
  const failed = !!word && !local && !!fetched && !fetched.entry;
  return (
    <Modal visible={!!word} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close word card" />
      {(loading || failed) && !!word && (
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {!!hint?.reading && <Text style={styles.reading}>{hint.reading}</Text>}
          <Text style={styles.word}>{word}</Text>
          {loading ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 12 }}>
              <ActivityIndicator color={C.accent} />
              <Text style={styles.romaji}>Looking it up…</Text>
            </View>
          ) : (
            <Text style={[styles.meaning, { color: C.sub }]}>Couldn't load the meaning here. Check your connection, or open it in Jisho.</Text>
          )}
          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.btnGhost]}
              onPress={() => Linking.openURL(`https://jisho.org/search/${encodeURIComponent(hint?.base ?? word)}`)}
            >
              <Text style={[styles.btnText, { color: C.ink }]}>Open in Jisho ↗</Text>
            </Pressable>
          </View>
        </View>
      )}
      {e && (
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reading}>{e.reading}</Text>
              <Text style={styles.word}>{e.surface}</Text>
              <Text style={styles.romaji}>{toRomaji(e.reading, e.pos === 'particle')}</Text>
            </View>
            <Pressable onPress={() => speakJapanese(e.surface)} style={styles.speak} accessibilityLabel="Play pronunciation">
              <Text style={{ fontSize: 22 }}>🔊</Text>
            </Pressable>
          </View>
          <View style={styles.tags}>
            <Text style={[styles.tag, { backgroundColor: LEVEL_COLOR[e.level], color: '#fff' }]}>{e.level === 'Other' ? 'not on JLPT lists' : e.level}</Text>
            <Text style={[styles.tag, { backgroundColor: C.line, color: C.ink }]}>{e.pos}</Text>
            {e.base && <Text style={[styles.tag, { backgroundColor: C.line, color: C.ink }]}>from {e.base}</Text>}
          </View>
          <Text style={styles.meaning}>{e.meaning}</Text>
          {context && (
            <View style={styles.context}>
              <Text style={styles.contextJp}>{joinTokens(context.jp)}</Text>
              <Text style={styles.contextEn}>{context.en}</Text>
            </View>
          )}
          <View style={styles.actions}>
            {saved ? (
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={onRemove}>
                <Text style={[styles.btnText, { color: C.ink }]}>✓ Saved · Remove</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.btn} onPress={onSave}>
                <Text style={styles.btnText}>＋ Save word</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.btn, styles.btnGhost]}
              onPress={() => Linking.openURL(`https://jisho.org/search/${encodeURIComponent(e.base ?? e.surface)}`)}
            >
              <Text style={[styles.btnText, { color: C.ink }]}>Jisho ↗</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: C.line, marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center' },
  reading: { color: C.sub, fontSize: 14 },
  word: { color: C.ink, fontSize: 40, fontWeight: '700' },
  romaji: { color: C.sub, fontStyle: 'italic' },
  speak: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  tags: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  meaning: { fontSize: 18, color: C.ink, marginTop: 14 },
  context: { backgroundColor: C.bg, borderRadius: 12, padding: 12, marginTop: 14 },
  contextJp: { fontSize: 16, color: C.ink },
  contextEn: { fontSize: 13, color: C.sub, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  btn: { flex: 1, backgroundColor: C.accent, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnGhost: { backgroundColor: C.line },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
