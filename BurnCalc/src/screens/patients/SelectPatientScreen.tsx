import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { auth } from '../../services/firebase/firebase';
import { getDoctorPatients, attachCalculationToPatient } from '../../services/firebase/patients';
import { attachCalculationToPatient as attachLocalCalculation } from '../../db/repositories/calculationRepository'; // Импорт из локальной БД

export default function SelectPatientScreen() {
    const { params }: any = useRoute();
    const navigation = useNavigation();
    const calculation = params.calculation;

    const [patients, setPatients] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const doctorId = auth.currentUser?.uid;
        if (!doctorId) return;
        setPatients(await getDoctorPatients(doctorId));
    };

    const select = async (patientId: string) => {
        const doctorId = auth.currentUser?.uid;
        if (!doctorId) return;

        try {
            // 1. Обновляем локальную БД
            await attachLocalCalculation(calculation.id, patientId);

            // 2. Обновляем Firebase
            await attachCalculationToPatient(doctorId, patientId, calculation);

            Alert.alert('Успешно', 'Расчёт привязан к пациенту');
            navigation.goBack();
        } catch (error) {
            console.error('Ошибка при привязке расчёта:', error);
            Alert.alert('Ошибка', 'Не удалось привязать расчёт к пациенту');
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 22, marginBottom: 16 }}>Выбор пациента</Text>

            <FlatList
                data={patients}
                keyExtractor={i => i.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: '#ddd',
                            backgroundColor: '#fff',
                        }}
                        onPress={() => select(item.id)}
                    >
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>{item.phone}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                        Нет сохранённых пациентов
                    </Text>
                }
            />
        </View>
    );
}