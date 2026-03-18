import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DashboardScreen  from './screens/Dashboard';
import TransactionsScreen from './screens/Transactions';
import AddScreen        from './screens/Add';
import SMSScreen        from './screens/SMS';
import InsightsScreen   from './screens/Insights';

const Tab = createBottomTabNavigator();

const COLORS = { bg: '#0a0e1a', surface: '#111827', border: '#1e2d45', text3: '#64748b' };

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, marginTop: 2, color: focused ? '#60a5fa' : COLORS.text3, fontWeight: focused ? '700' : '400' }}>
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle:       { backgroundColor: COLORS.bg, borderBottomColor: COLORS.border, borderBottomWidth: 1, elevation: 0 },
            headerTitleStyle:  { color: '#f1f5f9', fontWeight: '700', fontSize: 18 },
            tabBarStyle:       { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, borderTopWidth: 1, height: 68, paddingBottom: 6 },
            tabBarShowLabel:   false,
          }}>
          <Tab.Screen name="Dashboard"    component={DashboardScreen}    options={{ title: '₹ PayTrack',       tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Home"    focused={focused} /> }} />
          <Tab.Screen name="Transactions" component={TransactionsScreen}  options={{ title: 'Transactions',    tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="History" focused={focused} /> }} />
          <Tab.Screen name="Add"          component={AddScreen}           options={{ title: 'Add Transaction', tabBarIcon: ({ focused }) => (
            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginBottom: 8, elevation: 4, shadowColor: '#3b82f6', shadowOpacity: 0.5, shadowRadius: 8 }}>
              <Text style={{ color: 'white', fontSize: 28, lineHeight: 32, fontWeight: '300' }}>+</Text>
            </View>
          )}} />
          <Tab.Screen name="SMS"          component={SMSScreen}           options={{ title: 'Parse SMS',       tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="SMS"     focused={focused} /> }} />
          <Tab.Screen name="Insights"     component={InsightsScreen}      options={{ title: 'Insights',        tabBarIcon: ({ focused }) => <TabIcon emoji="💡" label="Insights" focused={focused} /> }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
