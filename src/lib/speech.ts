import * as Speech from 'expo-speech';

let voiceCache: Speech.Voice[] | null = null;

async function japaneseVoices(): Promise<Speech.Voice[]> {
  if (voiceCache) return voiceCache;
  try {
    const all = await Speech.getAvailableVoicesAsync();
    voiceCache = all.filter((v) => v.language?.toLowerCase().startsWith('ja'));
  } catch {
    voiceCache = [];
  }
  return voiceCache;
}

export async function speakJapanese(
  text: string,
  opts: { slow?: boolean; voice?: 'a' | 'b'; onDone?: () => void } = {},
) {
  // Some devices (and browsers without a Japanese voice) never fire onDone,
  // so a fallback timer keeps the scene moving.
  let finished = false;
  const once = () => {
    if (finished) return;
    finished = true;
    clearTimeout(fallback);
    opts.onDone?.();
  };
  const fallback = setTimeout(once, 1500 + text.length * (opts.slow ? 380 : 260));
  const voices = await japaneseVoices();
  const pick = voices.length > 1 && opts.voice === 'b' ? voices[1] : voices[0];
  Speech.speak(text, {
    language: 'ja-JP',
    voice: pick?.identifier,
    rate: opts.slow ? 0.7 : 0.95,
    pitch: opts.voice === 'b' ? 1.15 : 0.95,
    onDone: once,
    onError: once,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
