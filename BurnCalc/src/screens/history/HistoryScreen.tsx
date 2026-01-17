import React, { useContext, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { getCalculationsByUserId, getCalculationsByDoctorId } from '../../db/repositories/calculationRepository';
import { CalculationEntity } from '../../models/Calculation';
import { getPatientById } from '../../db/repositories/patientRepository';

export default function HistoryScreen() {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const [calculations, setCalculations] = useState<CalculationEntity[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadCalculations();
        }, [user])
    );

    const loadCalculations = async () => {
        if (!user?.uid) {
            console.log('Нет пользователя для загрузки расчётов');
            setCalculations([]);
            return;
        }

        console.log('Загружаем расчёты для:', user.uid, 'роль:', user.role);

        let data: CalculationEntity[] = [];

        try {
            if (user.role === 'patient') {
                // Пациент видит только свои расчёты
                data = await getCalculationsByUserId(user.uid);
                console.log('Пациент получил расчётов:', data.length);
            } else if (user.role === 'doctor') {
                // Врач видит расчёты, созданные им
                data = await getCalculationsByDoctorId(user.uid);
                console.log('Врач получил расчётов:', data.length);
            }
        } catch (error) {
            console.error('Ошибка при загрузке расчётов:', error);
        }

        // Для врача добавляем имена пациентов
        const enhanced: CalculationEntity[] = await Promise.all(
            data.map(async (calc) => {
                if (calc.patientId) {
                    try {
                        const patient = await getPatientById(calc.patientId);
                        return { ...calc, patientName: patient?.fullName || 'Неизвестный пациент' };
                    } catch (error) {
                        console.error('Ошибка при загрузке пациента:', error);
                        return calc;
                    }
                }
                return calc;
            })
        );

        console.log('Улучшенных расчётов:', enhanced.length);
        setCalculations(enhanced);
    };

    const renderItem = ({ item }: { item: CalculationEntity }) => {
        const hasPatient = Boolean(item.patientName);

        return (
            <View style={styles.card}>
                <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleString()}
                </Text>

                <Text>ПОТ: {item.totalTBSA}%</Text>
                <Text>ИТП: {item.itp}</Text>
                <Text>Тяжесть: {item.burnSeverity}</Text>
                <Text>Прогноз: {item.prognosis}</Text>

                {/* Отображаем имя пациента, если есть */}
                {hasPatient && (
                    <View style={styles.patientBox}>
                        <Text style={styles.patientLabel}>Пациент:</Text>
                        <Text style={styles.patientName}>{item.patientName}</Text>
                    </View>
                )}

                {/* Если врач и нет пациента — показываем кнопки */}
                {user?.role === 'doctor' && !hasPatient && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.primary}
                            onPress={() =>
                                navigation.navigate('CreatePatient', { calculation: item })
                            }
                        >
                            <Text style={styles.btnText}>Создать профиль пациента</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondary}
                            onPress={() =>
                                navigation.navigate('SelectPatient', { calculation: item })
                            }
                        >
                            <Text style={styles.btnText}>Выбрать существующего</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Для пациентов показываем метку "личный расчёт" */}
                {user?.role === 'patient' && (
                    <View style={styles.patientBox}>
                        <Text style={styles.patientLabel}>Личный расчёт</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>История расчётов</Text>

            <FlatList
                data={calculations}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={{ marginTop: 20, textAlign: 'center', color: '#666' }}>
                        {user ? 'Нет сохранённых отчётов' : 'Войдите в систему'}
                    </Text>
                }
            />
        </View>
    );
}

// Стили
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 16, marginTop: 30 },
    card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
    date: { fontWeight: '600', marginBottom: 6 },
    actions: { marginTop: 12, gap: 8 },
    primary: { backgroundColor: '#1E88E5', padding: 10, borderRadius: 6, alignItems: 'center' },
    secondary: { backgroundColor: '#546E7A', padding: 10, borderRadius: 6, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '600' },
    patientBox: { marginTop: 12, padding: 10, backgroundColor: '#E3F2FD', borderRadius: 6 },
    patientLabel: { fontSize: 12, color: '#555' },
    patientName: { fontSize: 16, fontWeight: '700', marginTop: 2 },
});
