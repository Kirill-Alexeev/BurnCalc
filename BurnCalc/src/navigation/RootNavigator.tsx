import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DoctorStackNavigator from './DoctorStackNavigator';
import PatientStackNavigator from './PatientStackNavigator';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    return (
        <NavigationContainer>
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
        </NavigationContainer>
    );
}