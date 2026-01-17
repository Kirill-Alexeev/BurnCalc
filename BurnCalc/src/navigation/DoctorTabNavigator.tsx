import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalculatorScreen from '../screens/calculator/CalculatorScreen';
import PatientsScreen from '../screens/patients/PatientsScreen';
import HistoryScreen from '../screens/history/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function DoctorTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ title: 'Калькулятор' }} />
            <Tab.Screen name="Patients" component={PatientsScreen} options={{ title: 'Пациенты' }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'История' }} />
        </Tab.Navigator>
    );
}
