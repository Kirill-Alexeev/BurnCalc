import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalculatorScreen from '../screens/calculator/CalculatorScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import React from 'react';

const Tab = createBottomTabNavigator();

export default function PatientTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ title: 'Калькулятор' }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'История' }} />
        </Tab.Navigator>
    );
}
