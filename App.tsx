import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isDue } from './src/lib/srs';
import { StoreProvider, useStore } from './src/lib/store';
import { C } from './src/lib/theme';
import FeedScreen from './src/screens/FeedScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuizScreen from './src/screens/QuizScreen';
import StatsScreen from './src/screens/StatsScreen';
import WordsScreen from './src/screens/WordsScreen';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

const Tab = createBottomTabNavigator();

const icon = (emoji: string) => ({ focused }: { focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
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
        }}
      >
        <Tab.Screen name="Watch" component={FeedScreen} options={{ tabBarIcon: icon('🎬') }} />
        <Tab.Screen name="Words" component={WordsScreen} options={{ tabBarIcon: icon('📒'), tabBarBadge: due > 0 ? due : undefined }} />
        <Tab.Screen name="Quiz" component={QuizScreen} options={{ tabBarIcon: icon('❓') }} />
        <Tab.Screen name="Progress" component={StatsScreen} options={{ tabBarIcon: icon('🔥') }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon('👤') }} />
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
