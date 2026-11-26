import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Small, consistent touch feedback. Does nothing on the web preview.
const on = Platform.OS !== 'web';
const run = (p: () => Promise<void>) => {
  if (on) p().catch(() => {});
};

export const tap = (): void => run(() => Haptics.selectionAsync());
export const success = (): void => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const warning = (): void => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
