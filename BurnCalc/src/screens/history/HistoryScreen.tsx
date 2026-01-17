import { View, Text } from 'react-native';

export default function HistoryScreen() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>
                История расчётов
            </Text>

            <Text style={{ marginTop: 12 }}>
                Здесь будет список сохранённых расчётов (заглушка)
            </Text>
        </View>
    );
}
