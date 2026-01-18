import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientTabNavigator from './PatientTabNavigator';
import InfoScreen from '../screens/main/InfoScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ChartsScreen from '../screens/charts/ChartsScreen';

const Stack = createNativeStackNavigator();

export default function PatientStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PatientTab"
                component={PatientTabNavigator}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Info"
                component={InfoScreen}
                options={{ title: 'Информация' }}
            />

            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Настройки' }}
            />

            <Stack.Screen
                name="Charts"
                component={ChartsScreen}
                options={{ title: 'Графики динамики' }}
            />
        </Stack.Navigator>
    );
}