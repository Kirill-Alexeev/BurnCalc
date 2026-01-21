import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { AuthContext, Role } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const { register } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('doctor');

    const handleRegister = async () => {
        try {
            await register(email, password, role);
            Alert.alert('Успех', 'Регистрация завершена');
        } catch (e: any) {
            Alert.alert('Ошибка', e.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Image
                source={require('../../assets/logo.png')}
                style={{ width: 100, height: 150, marginBottom: 10 }}
            />
            <Text style={{
                fontSize: 16,
                color: '#666',
                marginBottom: 20,
            }}>Калькулятор площади ожогов</Text>
            <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 24 }}>Регистрация</Text>

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
                    marginBottom: 12,
                }}
            />

            <TouchableOpacity
                onPress={handleRegister}
                style={{
                    width: '100%',
                    backgroundColor: '#1E88E5',
                    padding: 14,
                    borderRadius: 12,
                    marginBottom: 12,
                }}
            >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Зарегистрироваться</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: '#1E88E5' }}>Есть аккаунт? Войти</Text>
            </TouchableOpacity>
        </View>
    );
}
