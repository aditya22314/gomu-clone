import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { C } from '../lib/theme';

export function Pill({ label, on, onPress, color }: { label: string; on: boolean; onPress: () => void; color?: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={[styles.pill, on && { backgroundColor: color ?? C.accent, borderColor: color ?? C.accent }]}
    >
      <Text style={[styles.pillText, on && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <Pressable style={styles.toggleRow} onPress={() => onChange(!value)} accessibilityRole="switch" accessibilityState={{ checked: value }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <View style={[styles.track, value && { backgroundColor: C.teal }]}>
        <View style={[styles.thumb, value && { alignSelf: 'flex-end' }]} />
      </View>
    </Pressable>
  );
}

export function Stepper({ value, onChange, min, max, step = 1, format }: { value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string }) {
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.stepBtn} onPress={() => onChange(Math.max(min, value - step))} accessibilityLabel="Decrease">
        <Text style={styles.stepText}>−</Text>
      </Pressable>
      <Text style={styles.stepValue}>{format ? format(value) : value}</Text>
      <Pressable style={styles.stepBtn} onPress={() => onChange(Math.min(max, value + step))} accessibilityLabel="Increase">
        <Text style={styles.stepText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, marginRight: 8, marginBottom: 8 },
  pillText: { color: C.ink, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  toggleLabel: { color: C.ink, fontSize: 16, fontWeight: '600' },
  hint: { color: C.sub, fontSize: 12, marginTop: 2 },
  track: { width: 50, height: 30, borderRadius: 15, backgroundColor: C.line, padding: 3, justifyContent: 'center' },
  thumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.line, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 20, color: C.ink, fontWeight: '700' },
  stepValue: { fontSize: 18, fontWeight: '800', color: C.ink, minWidth: 70, textAlign: 'center' },
});
