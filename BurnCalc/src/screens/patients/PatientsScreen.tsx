import { View, Text, TouchableOpacity } from 'react-native';

export default function PatientsScreen() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
                Пациенты
            </Text>

            <Text>Список пациентов (пока заглушка)</Text>

            <TouchableOpacity
                style={{
                    marginTop: 24,
                    backgroundColor: '#1E88E5',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                    Добавить пациента
                </Text>
            </TouchableOpacity>
        </View>
    );
}
