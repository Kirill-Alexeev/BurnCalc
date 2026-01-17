import { View, Text, Button } from 'react-native';

export default function RegisterScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 16 }}>Экран регистрации</Text>
            <Button title="Зарегистрироваться (заглушка)" onPress={() => { }} />
        </View>
    );
}
