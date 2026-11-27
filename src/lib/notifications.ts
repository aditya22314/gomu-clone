import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const ID = 'mimi-daily-reminder';

// Returns false when reminders can't be set up (web, permission denied, or a device/app that
// doesn't support them, such as Expo Go on Android), so callers can carry on without one.
export async function scheduleDailyReminder(hour: number, minute: number): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    return await schedule(hour, minute);
  } catch (e) {
    console.warn('Could not set up the daily reminder', e);
    return false;
  }
}

async function schedule(hour: number, minute: number): Promise<boolean> {
  const perm = await Notifications.getPermissionsAsync();
  let granted = perm.granted;
  if (!granted) granted = (await Notifications.requestPermissionsAsync()).granted;
  if (!granted) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily', {
      name: 'Daily reminder',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  await Notifications.cancelScheduledNotificationAsync(ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: { title: 'Time for some Japanese 🍊', body: 'A few scenes and a quick review keep your streak alive.' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: 'daily' },
  });
  return true;
}

export async function cancelDailyReminder() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(ID).catch(() => {});
}
