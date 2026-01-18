import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorTabNavigator from './DoctorTabNavigator';
import CreatePatientScreen from '../screens/patients/CreatePatientScreen';
import SelectPatientScreen from '../screens/patients/SelectPatientScreen';
import InfoScreen from '../screens/main/InfoScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ChartsScreen from '../screens/charts/ChartsScreen';

const Stack = createNativeStackNavigator();

export default function DoctorStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DoctorTab"
                component={DoctorTabNavigator}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="CreatePatient"
                component={CreatePatientScreen}
                options={{ title: 'Новый пациент' }}
            />

            <Stack.Screen
                name="SelectPatient"
                component={SelectPatientScreen}
                options={{ title: 'Выбор пациента' }}
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