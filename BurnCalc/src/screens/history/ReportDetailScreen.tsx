import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { CalculationEntity, CalculationZone } from '../../models/Calculation';
import { getPatientById } from '../../db/repositories/patientRepository';
import { Ionicons } from '@expo/vector-icons';

export default function ReportDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<CalculationEntity | null>(null);
    const [patientName, setPatientName] = useState<string>('');
    const [expandedZones, setExpandedZones] = useState<boolean[]>([]);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {
        try {
            const { reportId, calculation } = route.params as any;

            if (calculation) {
                setReport(calculation);

                // Если врач и есть patientId, загружаем имя пациента
                if (user?.role === 'doctor' && calculation.patientId) {
                    const patient = await getPatientById(calculation.patientId);
                    if (patient) {
                        setPatientName(patient.fullName || 'Неизвестный пациент');
                    }
                }

                // Инициализируем массив развернутых зон
                if (calculation.zones) {
                    setExpandedZones(new Array(calculation.zones.length).fill(false));
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки отчёта:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить отчёт');
        } finally {
            setLoading(false);
        }
    };

    const toggleZoneExpand = (index: number) => {
        const newExpanded = [...expandedZones];
        newExpanded[index] = !newExpanded[index];
        setExpandedZones(newExpanded);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        });
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAgeGroupLabel = (ageGroup: string) => {
        switch (ageGroup) {
            case 'infant': return 'Младенец (до 1 года)';
            case 'child1to4': return '1-4 года';
            case 'child5to14': return '5-14 лет';
            case 'adult': return '15+ лет)';
            default: return ageGroup;
        }
    };

    const getDegreeLabel = (degree: number) => {
        switch (degree) {
            case 1: return 'I степень (поверхностный)';
            case 2: return 'II степень (пузыри)';
            case 3: return 'III степень (глубокий)';
            case 4: return 'IV степень (обугливание)';
            default: return `${degree} степень`;
        }
    };

    const getFractionLabel = (fraction: number) => {
        switch (fraction) {
            case 0: return '0% (нет поражения)';
            case 0.5: return '50% площади зоны';
            case 1: return '100% площади зоны';
            default: return `${fraction * 100}%`;
        }
    };

    const getBodyPartLabel = (bodyPart: string) => {
        const labels: Record<string, string> = {
            'head': 'Голова',
            'front': 'Передняя поверхность туловища',
            'back': 'Задняя поверхность туловища',
            'left_arm': 'Левая рука',
            'right_arm': 'Правая рука',
            'left_leg': 'Левая нога',
            'right_leg': 'Правая нога',
            'perineum': 'Промежность'
        };
        return labels[bodyPart] || bodyPart;
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1E88E5" />
                <Text style={styles.loadingText}>Загрузка отчёта...</Text>
            </View>
        );
    }

    if (!report) {
        return (
            <View style={styles.centered}>
                <Ionicons name="document-text" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Отчёт не найден</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text>Вернуться назад</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Основная информация */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📄 Основная информация</Text>

                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Дата создания:</Text>
                        <Text style={styles.infoValue}>{formatDate(report.createdAt)}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Время:</Text>
                        <Text style={styles.infoValue}>{formatTime(report.createdAt)}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Возрастная группа:</Text>
                        <Text style={styles.infoValue}>{getAgeGroupLabel(report.ageGroup)}</Text>
                    </View>

                    {user?.role === 'doctor' && patientName && (
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Пациент:</Text>
                            <Text style={[styles.infoValue, styles.patientName]}>
                                {patientName}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Результаты расчёта */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Результаты расчёта</Text>

                <View style={styles.resultsContainer}>
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Общая ПОТ</Text>
                        <Text style={styles.resultValue}>{report.totalTBSA}%</Text>
                        <Text style={styles.resultDescription}>
                            Общая площадь ожоговой поверхности
                        </Text>
                    </View>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Индекс ИТП</Text>
                        <Text style={styles.resultValue}>{report.itp}</Text>
                        <Text style={styles.resultDescription}>
                            Индекс тяжести поражения
                        </Text>
                    </View>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Тяжесть ожога</Text>
                        <Text style={[
                            styles.resultValue,
                        ]}>
                            {report.burnSeverity}
                        </Text>
                        <Text style={styles.resultDescription}>
                            Степень тяжести
                        </Text>
                    </View>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Прогноз</Text>
                        <Text style={[
                            styles.resultValue,
                        ]}>
                            {report.prognosis}
                        </Text>
                        <Text style={styles.resultDescription}>
                            Оценка по Франку
                        </Text>
                    </View>
                </View>
            </View>

            {/* Поражённые зоны */}
            {report.zones && report.zones.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🧬 Поражённые зоны ({report.zones.length})</Text>

                    <View style={styles.zonesContainer}>
                        {report.zones.map((zone: CalculationZone, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.zoneCard,
                                    expandedZones[index] && styles.zoneCardExpanded
                                ]}
                                onPress={() => toggleZoneExpand(index)}
                            >
                                <View style={styles.zoneHeader}>
                                    <View style={styles.zoneTitleContainer}>
                                        <Text style={styles.zoneTitle}>
                                            {getBodyPartLabel(zone.bodyPart)}
                                        </Text>
                                        <Text style={styles.zonePercent}>
                                            {zone.percent.toFixed(1)}% от общей площади
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name={expandedZones[index] ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#666"
                                    />
                                </View>

                                {expandedZones[index] && (
                                    <View style={styles.zoneDetails}>
                                        <View style={styles.zoneDetailRow}>
                                            <Text style={styles.zoneDetailLabel}>Степень ожога:</Text>
                                            <Text style={styles.zoneDetailValue}>
                                                {getDegreeLabel(zone.degree)}
                                            </Text>
                                        </View>

                                        <View style={styles.zoneDetailRow}>
                                            <Text style={styles.zoneDetailLabel}>Площадь поражения:</Text>
                                            <Text style={styles.zoneDetailValue}>
                                                {getFractionLabel(zone.fraction)}
                                            </Text>
                                        </View>

                                        <View style={styles.zoneDetailRow}>
                                            <Text style={styles.zoneDetailLabel}>Вклад в ИТП:</Text>
                                            <Text style={styles.zoneDetailValue}>
                                                {zone.degree <= 2 ? zone.percent.toFixed(1) : (zone.percent * 3).toFixed(1)} баллов
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Кнопки действий */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        // Здесь можно добавить функцию печати или экспорта
                        Alert.alert('В разработке', 'Функция экспорта в разработке');
                    }}
                >
                    <Ionicons name="share" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Поделиться отчётом</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 20,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    infoGrid: {
        gap: 12,
    },
    infoItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
        textAlign: 'left',
    },
    patientName: {
        color: '#1E88E5',
        fontWeight: '700',
    },
    resultsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 2,
    },
    resultCard: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        marginBottom: 3,
    },
    resultLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    resultValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E88E5',
        marginBottom: 4,
        textAlign: 'center',
    },
    resultDescription: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    zonesContainer: {
        gap: 12,
    },
    zoneCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    zoneCardExpanded: {
        backgroundColor: '#f0f7ff',
        borderColor: '#1E88E5',
    },
    zoneHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    zoneTitleContainer: {
        flex: 1,
    },
    zoneTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    zonePercent: {
        fontSize: 13,
        color: '#666',
    },
    zoneDetails: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    zoneDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    zoneDetailLabel: {
        fontSize: 14,
        color: '#666',
    },
    zoneDetailValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 10,
    },
    noteCard: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        borderRadius: 10,
        padding: 16,
        gap: 12,
    },
    noteContent: {
        flex: 1,
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1976D2',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 14,
        color: '#546E7A',
        lineHeight: 20,
    },
    actionsContainer: {
        padding: 20,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1E88E5',
        padding: 16,
        borderRadius: 10,
        elevation: 3,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    secondaryButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});