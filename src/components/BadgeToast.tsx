import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { success } from '../lib/haptics';
import { ACHIEVEMENTS, useStore } from '../lib/store';
import { C } from '../lib/theme';

// Pops up a small banner when a new badge is earned.
export default function BadgeToast() {
  const { state, loaded } = useStore();
  const insets = useSafeAreaInsets();
  const seen = useRef<Set<string> | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const y = useRef(new Animated.Value(-140)).current;

  useEffect(() => {
    if (!loaded) return;
    const ids = Object.keys(state.achievements);
    if (!seen.current) {
      // badges that already existed when the app opened are not news
      seen.current = new Set(ids);
      return;
    }
    const fresh = ids.filter((id) => !seen.current!.has(id));
    if (fresh.length) {
      fresh.forEach((id) => seen.current!.add(id));
      setQueue((q) => [...q, ...fresh]);
    }
  }, [state.achievements, loaded]);

  // a reset clears badges; forget them so they can be celebrated again
  useEffect(() => {
    if (loaded && seen.current && Object.keys(state.achievements).length === 0) seen.current = new Set();
  }, [state.achievements, loaded]);

  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    success();
    Animated.spring(y, { toValue: 0, useNativeDriver: true, friction: 7 }).start();
    const t = setTimeout(dismiss, 3200);
    return () => clearTimeout(t);
  }, [current]);

  const dismiss = () => {
    Animated.timing(y, { toValue: -140, duration: 220, useNativeDriver: true }).start(() => setQueue((q) => q.slice(1)));
  };

  const a = ACHIEVEMENTS.find((x) => x.id === current);
  if (!a) return null;
  return (
    <Animated.View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 8, transform: [{ translateY: y }] }]}>
      <Pressable style={styles.toast} onPress={dismiss} accessibilityRole="alert" accessibilityLabel={`Badge earned: ${a.title}`}>
        <Text style={styles.emoji}>{a.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>Badge earned</Text>
          <Text style={styles.title}>{a.title}</Text>
          <Text style={styles.desc}>{a.desc}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, zIndex: 100, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.ink,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  emoji: { fontSize: 34 },
  kicker: { color: C.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 16, fontWeight: '800' },
  desc: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
});
