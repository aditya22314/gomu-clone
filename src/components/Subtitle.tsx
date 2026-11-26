import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hasKanji, isPunctuation, lookup } from '../data/dictionary';
import { toRomaji } from '../lib/romaji';

type Props = {
  jp: string;
  en: string;
  active?: boolean;
  showFurigana: boolean;
  showRomaji: boolean;
  showEnglish: boolean;
  savedWords: Record<string, unknown>;
  onTapWord: (surface: string) => void;
  dark?: boolean;
};

export function tokensOf(jp: string): string[] {
  return jp.split(' ').filter(Boolean);
}

export function lineRomaji(jp: string): string {
  return tokensOf(jp)
    .map((t) => {
      if (isPunctuation(t)) return t.replace('。', '.').replace('、', ',').replace('！', '!').replace('？', '?');
      const e = lookup(t);
      return toRomaji(e?.reading ?? t, e?.pos === 'particle');
    })
    .join(' ')
    .replace(/ ([.,!?])/g, '$1');
}

export default function Subtitle({ jp, en, active, showFurigana, showRomaji, showEnglish, savedWords, onTapWord, dark }: Props) {
  const color = dark ? '#FFFFFF' : '#1F1B2E';
  const dim = dark ? 'rgba(255,255,255,0.7)' : '#6B6680';
  return (
    <View style={[styles.wrap, active && (dark ? styles.activeDark : styles.activeLight)]}>
      <View style={styles.row}>
        {tokensOf(jp).map((t, i) => {
          const entry = lookup(t);
          if (!entry || isPunctuation(t)) {
            return (
              <View key={i} style={styles.token}>
                {showFurigana && <Text style={styles.furigana}> </Text>}
                <Text style={[styles.jp, { color }]}>{t}</Text>
              </View>
            );
          }
          const saved = !!savedWords[t];
          return (
            <Pressable
              key={i}
              onPress={() => onTapWord(t)}
              accessibilityRole="button"
              accessibilityLabel={`${t}, ${entry.meaning}`}
              style={({ pressed }) => [styles.token, pressed && { opacity: 0.6 }]}
            >
              {showFurigana && (
                <Text style={[styles.furigana, { color: dim }]}>{hasKanji(t) ? entry.reading : ' '}</Text>
              )}
              <Text style={[styles.jp, { color }, styles.tappable, saved && styles.saved]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>
      {showRomaji && <Text style={[styles.romaji, { color: dim }]}>{lineRomaji(jp)}</Text>}
      {showEnglish && <Text style={[styles.en, { color: dim }]}>{en}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, marginVertical: 3 },
  activeDark: { backgroundColor: 'rgba(0,0,0,0.35)' },
  activeLight: { backgroundColor: '#FFE3DA' },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' },
  token: { alignItems: 'center', marginRight: 2 },
  furigana: { fontSize: 10, lineHeight: 13 },
  jp: { fontSize: 22, fontWeight: '600' },
  tappable: { textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  saved: { color: '#FFB199' },
  romaji: { fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  en: { fontSize: 15, marginTop: 2 },
});
