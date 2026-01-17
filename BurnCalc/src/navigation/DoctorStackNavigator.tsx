import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorTabNavigator from './DoctorTabNavigator';
import CreatePatientScreen from '../screens/patients/CreatePatientScreen';
import SelectPatientScreen from '../screens/patients/SelectPatientScreen';

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
        </Stack.Navigator>
    );
}
