import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import DoctorTabNavigator from './DoctorTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const isAuth = true; // потом заменишь на AuthContext

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuth ? (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            ) : (
                <Stack.Screen name="DoctorApp" component={DoctorTabNavigator} />
            )}
        </Stack.Navigator>
    );
}
