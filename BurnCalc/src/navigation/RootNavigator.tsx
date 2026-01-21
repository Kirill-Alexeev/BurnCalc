import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DoctorStackNavigator from './DoctorStackNavigator';
import PatientStackNavigator from './PatientStackNavigator';
import { AuthContext } from '../context/AuthContext';
import { useNotificationNavigation } from './navigationSetup';

const Stack = createNativeStackNavigator();

function NavigationContent() {
    const { user, loading } = useContext(AuthContext);

    // Инициализируем обработку уведомлений ВНУТРИ NavigationContainer
    useNotificationNavigation();

    if (loading) return null;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : user.role === 'doctor' ? (
                <Stack.Screen name="DoctorApp" component={DoctorStackNavigator} />
            ) : (
                <Stack.Screen name="PatientApp" component={PatientStackNavigator} />
            )}
        </Stack.Navigator>
    );
}

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <NavigationContent />
        </NavigationContainer>
    );
}