import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainScreen from '../screens/main/DoctorHomeScreen';
import CalculatorScreen from "../screens/calculator/CalculatorScreen";
import { AuthContext } from '../context/AuthContext';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Calculator: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return null; // или спиннер
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    // Пользователь не вошёл → показываем Login / Register
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    // Пользователь уже вошёл → главный экран
                    <Stack.Screen name="Calculator" component={CalculatorScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
