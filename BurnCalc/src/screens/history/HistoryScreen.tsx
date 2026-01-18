import React, { useContext, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { getCalculationsByUserId, getCalculationsByDoctorId } from '../../db/repositories/calculationRepository';
import { CalculationEntity } from '../../models/Calculation';
import { getPatientById } from '../../db/repositories/patientRepository';
import SimpleFilterPanel, { FilterOptions } from '../../components/FilterPanel';

export default function HistoryScreen() {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const [calculations, setCalculations] = useState<CalculationEntity[]>([]);
    const [allCalculations, setAllCalculations] = useState<CalculationEntity[]>([]);
    const [filters, setFilters] = useState<FilterOptions>({});

    useFocusEffect(
        useCallback(() => {
            loadCalculations();
        }, [user])
    );

    // Применяем фильтры
    const applyFilters = useCallback((calculationsList: CalculationEntity[], filterOptions: FilterOptions) => {
        return calculationsList.filter(calc => {
            // Фильтр по имени пациента (только для врачей)
            if (filterOptions.patientName && user?.role === 'doctor') {
                if (!calc.patientName || !calc.patientName.toLowerCase().includes(filterOptions.patientName.toLowerCase())) {
                    return false;
                }
            }

            // Фильтр по дате
            const calcDate = new Date(calc.createdAt);

            if (filterOptions.dateFrom) {
                const fromDate = new Date(filterOptions.dateFrom);
                if (calcDate < fromDate) return false;
            }

            if (filterOptions.dateTo) {
                const toDate = new Date(filterOptions.dateTo);
                toDate.setHours(23, 59, 59, 999); // До конца дня
                if (calcDate > toDate) return false;
            }

            // Фильтр по ПОТ
            if (filterOptions.minTBSA) {
                const min = parseFloat(filterOptions.minTBSA);
                if (calc.totalTBSA < min) return false;
            }

            if (filterOptions.maxTBSA) {
                const max = parseFloat(filterOptions.maxTBSA);
                if (calc.totalTBSA > max) return false;
            }

            // Фильтр по ИТП
            if (filterOptions.minITP) {
                const min = parseFloat(filterOptions.minITP);
                if (calc.itp < min) return false;
            }

            if (filterOptions.maxITP) {
                const max = parseFloat(filterOptions.maxITP);
                if (calc.itp > max) return false;
            }

            return true;
        });
    }, [user]);

    // Когда меняются фильтры, обновляем отфильтрованный список
    useMemo(() => {
        const filtered = applyFilters(allCalculations, filters);
        setCalculations(filtered);
    }, [allCalculations, filters, applyFilters]);

    const loadCalculations = async () => {
        if (!user?.uid) {
            console.log('Нет пользователя для загрузки расчётов');
            setAllCalculations([]);
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
        setAllCalculations(enhanced);

        // Применяем текущие фильтры
        const filtered = applyFilters(enhanced, filters);
        setCalculations(filtered);
    };

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
        const filtered = applyFilters(allCalculations, newFilters);
        setCalculations(filtered);
    };

    const renderItem = ({ item, index }: { item: CalculationEntity; index: number }) => {
        const hasPatient = Boolean(item.patientName);

        return (
            <View style={[styles.card, index % 2 === 0 ? styles.cardEven : styles.cardOdd]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.date}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.time}>
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.metricRow}>
                        <View style={styles.metric}>
                            <Text style={styles.metricLabel}>ПОТ</Text>
                            <Text style={styles.metricValue}>{item.totalTBSA}%</Text>
                        </View>
                        <View style={styles.metric}>
                            <Text style={styles.metricLabel}>ИТП</Text>
                            <Text style={styles.metricValue}>{item.itp}</Text>
                        </View>
                        <View style={styles.metric}>
                            <Text style={styles.metricLabel}>Тяжесть</Text>
                            <Text style={[styles.metricValue, getSeverityColor(item.burnSeverity)]}>
                                {item.burnSeverity}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.prognosis}>
                        <Text style={styles.prognosisLabel}>Прогноз: </Text>
                        {item.prognosis}
                    </Text>

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
                        <View style={styles.personalBadge}>
                            <Text style={styles.personalBadgeText}>Личный расчёт</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'лёгкий': return styles.severityMild;
            case 'средней тяжести': return styles.severityModerate;
            case 'тяжёлый': return styles.severitySevere;
            case 'крайне тяжёлый': return styles.severityCritical;
            default: return {};
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>История расчётов</Text>

            {/* Панель фильтров */}
            <SimpleFilterPanel
                userRole={user?.role || 'patient'}
                onFilterChange={handleFilterChange}
            />

            {/* Статистика */}
            <View style={styles.stats}>
                <Text style={styles.statsText}>
                    Найдено: {calculations.length} из {allCalculations.length}
                </Text>
                {Object.keys(filters).length > 0 && (
                    <Text style={styles.statsFiltered}>⚠️ Применены фильтры</Text>
                )}
            </View>

            {/* Список расчётов */}
            <FlatList
                data={calculations}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {allCalculations.length === 0
                                ? 'Нет сохранённых отчётов'
                                : 'Нет отчётов по выбранным фильтрам'}
                        </Text>
                        {allCalculations.length > 0 && Object.keys(filters).length > 0 && (
                            <TouchableOpacity
                                style={styles.clearFiltersButton}
                                onPress={() => handleFilterChange({})}
                            >
                                <Text style={styles.clearFiltersText}>Сбросить фильтры</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </View>
    );
}

// Обновлённые стили
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
    },
    statsFiltered: {
        fontSize: 12,
        color: '#FF9800',
        fontWeight: '500',
    },
    card: {
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardEven: {
        backgroundColor: '#fff',
    },
    cardOdd: {
        backgroundColor: '#fafafa',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f7ff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    date: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E88E5',
    },
    time: {
        fontSize: 13,
        color: '#666',
    },
    cardBody: {
        padding: 16,
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    metric: {
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 2,
    },
    metricValue: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    prognosis: {
        fontSize: 15,
        marginBottom: 12,
        lineHeight: 20,
    },
    prognosisLabel: {
        fontWeight: '600',
        color: '#555',
    },
    severityMild: {
        color: '#4CAF50',
    },
    severityModerate: {
        color: '#FF9800',
    },
    severitySevere: {
        color: '#F44336',
    },
    severityCritical: {
        color: '#D32F2F',
    },
    patientBox: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#E3F2FD',
        borderRadius: 6
    },
    patientLabel: {
        fontSize: 12,
        color: '#555',
        marginBottom: 2,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E88E5',
    },
    actions: {
        marginTop: 16,
        gap: 8
    },
    primary: {
        backgroundColor: '#1E88E5',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center'
    },
    secondary: {
        backgroundColor: '#546E7A',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    personalBadge: {
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    personalBadgeText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    clearFiltersButton: {
        backgroundColor: '#1E88E5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    clearFiltersText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});