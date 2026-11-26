import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Small, consistent touch feedback. Does nothing on the web preview.
const on = Platform.OS !== 'web';

export const tap = () => on && Haptics.selectionAsync().catch(() => {});
export const success = () => on && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
export const warning = () => on && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
