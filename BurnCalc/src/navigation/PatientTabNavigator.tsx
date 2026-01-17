import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalculatorScreen from '../screens/calculator/CalculatorScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import HomeScreen from '../screens/main/HomeScreen';
import InfoScreen from '../screens/main/InfoScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import React from 'react';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function PatientTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let emoji = '';

                    if (route.name === 'Home') {
                        emoji = focused ? '🏠' : '🏠';
                    } else if (route.name === 'Calculator') {
                        emoji = focused ? '🧮' : '🧮';
                    } else if (route.name === 'History') {
                        emoji = focused ? '📋' : '📋';
                    }

                    return (
                        <Text style={{ fontSize: size, color: color }}>
                            {emoji}
                        </Text>
                    );
                },
                tabBarActiveTintColor: '#1E88E5',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Главная' }}
            />
            <Tab.Screen
                name="Calculator"
                component={CalculatorScreen}
                options={{ title: 'Калькулятор' }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'История' }}
            />
        </Tab.Navigator>
    );
}