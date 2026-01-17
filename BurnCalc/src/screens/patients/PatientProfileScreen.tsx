import { View, Text } from 'react-native';

export default function PatientProfileScreen() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>
                Профиль пациента
            </Text>

            <Text style={{ marginTop: 12 }}>
                Информация о пациенте (заглушка)
            </Text>
        </View>
    );
}
