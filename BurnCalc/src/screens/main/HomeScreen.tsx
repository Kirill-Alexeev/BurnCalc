import { View, Text, TouchableOpacity } from 'react-native';
import styles from './HomeStyles';

export default function DoctorHomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>BurnCalc</Text>
            <Text style={styles.subtitle}>Добро пожаловать 👋</Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Перейти к калькулятору</Text>
            </TouchableOpacity>
        </View>
    );
}
