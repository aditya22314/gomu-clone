import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isDue } from './src/lib/srs';
import { StoreProvider, useStore } from './src/lib/store';
import { C } from './src/lib/theme';
import FeedScreen from './src/screens/FeedScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuizScreen from './src/screens/QuizScreen';
import ReelsScreen from './src/screens/ReelsScreen';
import StatsScreen from './src/screens/StatsScreen';
import WordsScreen from './src/screens/WordsScreen';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const icon = (name: string) => ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
  <Ionicons name={(focused ? name : `${name}-outline`) as IconName} size={size} color={color} />
);

function Root() {
  const { state, loaded } = useStore();
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator color={C.accent} />
      </View>
    );
  }
  if (!state.onboarded) return <OnboardingScreen />;
  const due = Object.values(state.cards).filter((c) => isDue(c)).length;
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: C.accent,
          tabBarInactiveTintColor: C.sub,
          tabBarStyle: { backgroundColor: '#fff', borderTopColor: C.line },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
          tabBarBadgeStyle: { backgroundColor: C.accent, fontSize: 10 },
        }}
      >
        <Tab.Screen name="Scenes" component={FeedScreen} options={{ tabBarIcon: icon('albums') }} />
        <Tab.Screen name="Reels" component={ReelsScreen} options={{ tabBarIcon: icon('play-circle') }} />
        <Tab.Screen name="Words" component={WordsScreen} options={{ tabBarIcon: icon('book'), tabBarBadge: due > 0 ? due : undefined }} />
        <Tab.Screen name="Quiz" component={QuizScreen} options={{ tabBarIcon: icon('school') }} />
        <Tab.Screen name="Progress" component={StatsScreen} options={{ tabBarIcon: icon('flame') }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon('person-circle') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="auto" />
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
