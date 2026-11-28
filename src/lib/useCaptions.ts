import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReelLine } from '../data/reels';
import { fetchCaptionLines } from './captions';

export type CaptionStatus = 'loading' | 'ready' | 'none' | 'error';

const key = (videoId: string) => `mimi-captions-v1:${videoId}`;

// Subtitle lines for a video: the ones it ships with, otherwise YouTube's captions fetched on
// the phone the first time the video is shown, then kept on the device.
export function useCaptionLines(videoId: string, bundled: ReelLine[] | undefined, enabled: boolean) {
  const [lines, setLines] = useState<ReelLine[] | undefined>(bundled);
  const [status, setStatus] = useState<CaptionStatus>(bundled?.length ? 'ready' : 'loading');

  useEffect(() => {
    if (bundled?.length || !enabled) return;
    if (Platform.OS === 'web') {
      setStatus('none');
      return;
    }
    let alive = true;
    void (async () => {
      try {
        const cached = await AsyncStorage.getItem(key(videoId));
        let found: ReelLine[];
        if (cached) found = JSON.parse(cached) as ReelLine[];
        else {
          found = await fetchCaptionLines(videoId);
          await AsyncStorage.setItem(key(videoId), JSON.stringify(found));
        }
        if (!alive) return;
        setLines(found);
        setStatus(found.length ? 'ready' : 'none');
      } catch {
        if (alive) setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, [videoId, enabled, bundled]);

  return { lines, status };
}
