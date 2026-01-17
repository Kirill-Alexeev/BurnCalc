import { View, Text, Button } from 'react-native';

export default function LoginScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 16 }}>Экран входа</Text>
            <Button title="Войти (заглушка)" onPress={() => { }} />
        </View>
    );
}
