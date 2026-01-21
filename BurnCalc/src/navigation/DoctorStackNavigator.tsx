import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorTabNavigator from './DoctorTabNavigator';
import CreatePatientScreen from '../screens/patients/CreatePatientScreen';
import SelectPatientScreen from '../screens/patients/SelectPatientScreen';
import InfoScreen from '../screens/main/InfoScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ChartsScreen from '../screens/charts/ChartsScreen';
import ReportDetailScreen from '../screens/history/ReportDetailScreen';

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
                options={{ 
                    title: 'Новый пациент',
                    headerTitle: '',
                    headerBackTitle: 'Назад'
                }}
            />

            <Stack.Screen
                name="SelectPatient"
                component={SelectPatientScreen}
                options={{ 
                    title: 'Выбор пациента',
                    headerTitle: '',
                    headerBackTitle: 'Назад'
                }}
            />

            <Stack.Screen
                name="Info"
                component={InfoScreen}
                options={{ 
                    title: 'Информация',
                    headerTitle: '',
                    headerBackTitle: 'Назад'
                }}
            />

            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ 
                    title: 'Настройки',
                    headerTitle: '',
                    headerBackTitle: 'Назад'
                }}
            />

            <Stack.Screen
                name="Charts"
                component={ChartsScreen}
                options={{ 
                    title: 'Графики динамики',
                    headerTitle: '',
                    headerBackTitle: 'Назад'
                }}
            />

            <Stack.Screen
                name="ReportDetail"
                component={ReportDetailScreen}
                options={{ 
                    title: 'Детальный отчёт',
                    headerTitle: '',
                    headerBackTitle: 'Назад'
                }}
            />
        </Stack.Navigator>
    );
}