import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const { login } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch (e: any) {
            Alert.alert('Ошибка', e.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Image
                source={require('../../assets/logo.png')}
                style={{ width: 100, height: 150, marginBottom: 16 }}
            />
            <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 24 }}>Вход</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                    width: '100%',
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 12,
                    marginBottom: 12,
                }}
            />
            <TextInput
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    width: '100%',
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 12,
                    marginBottom: 24,
                }}
            />

            <TouchableOpacity
                onPress={handleLogin}
                style={{
                    width: '100%',
                    backgroundColor: '#1E88E5',
                    padding: 14,
                    borderRadius: 12,
                    marginBottom: 12,
                }}
            >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Войти</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#1E88E5' }}>Нет аккаунта? Зарегистрироваться</Text>
            </TouchableOpacity>
        </View>
    );
}
