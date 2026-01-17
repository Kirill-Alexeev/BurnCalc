import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebase/firebase';
import { savePatientWithCalculation } from '../../services/firebase/patients';
import { useState } from 'react';
import { generateUUID } from '../../utils/uuid';
import { DoctorTabParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { insertPatient } from '../../db/repositories/patientRepository'; // Импорт для локальной БД
import { attachCalculationToPatient } from '../../db/repositories/calculationRepository'; // Импорт для локальной БД

export default function CreatePatientScreen() {
    const { params }: any = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<DoctorTabParamList>>();
    const calculation = params.calculation;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submit = async () => {
        if (!name.trim()) {
            Alert.alert('Ошибка', 'Введите ФИО пациента');
            return;
        }

        const doctorId = auth.currentUser?.uid;
        if (!doctorId) {
            Alert.alert('Ошибка', 'Пользователь не авторизован');
            return;
        }

        setIsLoading(true);

        try {
            const patientId = generateUUID();

            // 1. Сохраняем пациента в локальную БД
            await insertPatient({
                id: patientId,
                doctorId,
                fullName: name,
                phone: phone || undefined,
                address: address || undefined,
                createdAt: Date.now(),
            });

            // 2. Обновляем расчёт с patientId в локальной БД
            await attachCalculationToPatient(calculation.id, patientId);

            // 3. Сохраняем в Firebase
            await savePatientWithCalculation(
                doctorId,
                {
                    id: patientId,
                    name,
                    phone,
                    address,
                },
                calculation
            );

            Alert.alert('Успешно', 'Пациент создан и расчёт привязан');
            navigation.popToTop();

        } catch (error) {
            console.error('Ошибка при создании пациента:', error);
            Alert.alert('Ошибка', 'Не удалось создать пациента');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Новый пациент</Text>

            <TextInput
                placeholder="Введите ФИО *"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoFocus
            />

            <TextInput
                placeholder="Введите номер телефона"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TextInput
                placeholder="Введите адрес проживания"
                style={styles.input}
                value={address}
                onChangeText={setAddress}
            />

            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={submit}
                disabled={isLoading}
            >
                <Text style={styles.btnText}>
                    {isLoading ? 'Сохранение...' : 'Создать'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9'
    },
    button: {
        backgroundColor: '#1E88E5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20
    },
    buttonDisabled: {
        backgroundColor: '#90CAF9',
        opacity: 0.7
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16
    },
});