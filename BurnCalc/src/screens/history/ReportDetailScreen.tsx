import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { CalculationEntity, CalculationZone } from '../../models/Calculation';
import { getPatientById } from '../../db/repositories/patientRepository';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleCheckupNotification, requestNotificationPermissions } from '../../services/notificationService';
import { getNotificationSchedulesByDoctor, deleteNotificationSchedule } from '../../db/repositories/notificationRepository';
import { NotificationSchedule } from '../../models/notificationModel';

export default function ReportDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<CalculationEntity | null>(null);
    const [patientName, setPatientName] = useState<string>('');
    const [expandedZones, setExpandedZones] = useState<boolean[]>([]);

    // Состояния для уведомлений
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [scheduledNotifications, setScheduledNotifications] = useState<NotificationSchedule[]>([]);
    const [notificationDate, setNotificationDate] = useState(new Date(Date.now() + 86400000)); // Завтра
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [scheduling, setScheduling] = useState(false);

    // Добавляем состояние для общего количества уведомлений
    const [totalNotifications, setTotalNotifications] = useState<number>(0);

    // Используйте это:
    useEffect(() => {
        loadReport();
    }, []);

    // Добавьте отдельный эффект для уведомлений
    useEffect(() => {
        if (user?.role === 'doctor' && report?.patientId) {
            loadScheduledNotifications();
        }
    }, [user, report?.patientId]);

    const loadReport = async () => {
        try {
            const { reportId, calculation } = route.params as any;

            if (calculation) {
                setReport(calculation);

                if (user?.role === 'doctor' && calculation.patientId) {
                    const patient = await getPatientById(calculation.patientId);
                    if (patient) {
                        const name = patient.fullName || 'Неизвестный пациент';
                        setPatientName(name);
                    }
                }

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

    const loadScheduledNotifications = async () => {
        if (!user?.uid || !report?.patientId) return;

        try {
            const notifications = await getNotificationSchedulesByDoctor(user.uid);
            const patientNotifications = notifications.filter(n => n.patientId === report.patientId);

            // Сортируем по дате (от ближайшей к дальнейшей) и берем первые 5
            const sortedNotifications = patientNotifications
                .filter(n => n.isActive)
                .sort((a, b) => a.nextCheckupDate - b.nextCheckupDate)
                .slice(0, 5);

            setScheduledNotifications(sortedNotifications);

            // Обновляем общее количество
            const total = patientNotifications.filter(n => n.isActive).length;
            setTotalNotifications(total);
        } catch (error) {
            console.error('Ошибка загрузки уведомлений:', error);
        }
    };

    const handleScheduleNotification = async () => {
        if (!user?.uid || !report?.patientId || !patientName) {
            Alert.alert('Ошибка', 'Недостаточно данных для создания уведомления');
            return;
        }

        setScheduling(true);

        try {
            // Запрашиваем разрешения
            const granted = await requestNotificationPermissions();
            if (!granted) {
                Alert.alert('Требуется разрешение', 'Пожалуйста, разрешите уведомления в настройках устройства');
                setScheduling(false);
                return;
            }

            // Создаем уведомление
            const scheduleId = await scheduleCheckupNotification(
                user.uid,
                report.patientId,
                report.id,
                patientName,
                notificationDate
            );

            if (scheduleId) {
                Alert.alert('Успешно', 'Напоминание о обследовании запланировано');
                setShowNotificationModal(false);
                await loadScheduledNotifications();
            } else {
                Alert.alert('Ошибка', 'Не удалось запланировать напоминание');
            }
        } catch (error) {
            console.error('Ошибка при создании уведомления:', error);
            Alert.alert('Ошибка', 'Не удалось запланировать напоминание');
        } finally {
            setScheduling(false);
        }
    };

    const handleDeleteNotification = async (notificationId: string) => {
        Alert.alert(
            'Удалить напоминание?',
            'Вы уверены, что хотите удалить это напоминание?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteNotificationSchedule(notificationId);
                            await loadScheduledNotifications();
                            Alert.alert('Успешно', 'Напоминание удалено');
                        } catch (error) {
                            console.error('Ошибка при удалении уведомления:', error);
                            Alert.alert('Ошибка', 'Не удалось удалить напоминание');
                        }
                    }
                }
            ]
        );
    };

    const formatNotificationDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            case 'adult': return '15+ лет';
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

    // Функция для показа всех уведомлений
    const showAllNotifications = async () => {
        if (!user?.uid || !report?.patientId) return;
        try {
            const notifications = await getNotificationSchedulesByDoctor(user.uid);
            const patientNotifications = notifications
                .filter(n => n.patientId === report.patientId && n.isActive)
                .sort((a, b) => a.nextCheckupDate - b.nextCheckupDate);
            setScheduledNotifications(patientNotifications);
        } catch (error) {
            console.error('Ошибка загрузки всех уведомлений:', error);
        }
    };

    // Функция для сворачивания уведомлений
    const collapseNotifications = () => {
        const limited = scheduledNotifications.slice(0, 5);
        setScheduledNotifications(limited);
    };

    // Модальное окно для уведомлений
    const renderNotificationModal = () => (
        <Modal
            visible={showNotificationModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowNotificationModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Запланировать обследование</Text>
                        <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <Text style={styles.modalLabel}>Пациент:</Text>
                        <Text style={styles.patientName}>{patientName}</Text>

                        <Text style={styles.modalLabel}>Дата и время обследования:</Text>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar" size={20} color="#1E88E5" />
                            <Text style={styles.datePickerText}>
                                {notificationDate.toLocaleDateString('ru-RU')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Ionicons name="time" size={20} color="#1E88E5" />
                            <Text style={styles.datePickerText}>
                                {notificationDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={notificationDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setNotificationDate(selectedDate);
                                    }
                                }}
                                minimumDate={new Date()}
                            />
                        )}

                        {showTimePicker && (
                            <DateTimePicker
                                value={notificationDate}
                                mode="time"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowTimePicker(false);
                                    if (selectedDate) {
                                        setNotificationDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        <Text style={styles.notificationNote}>
                            ⏰ Напоминание придет за 10 минут до назначенного времени
                        </Text>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonConfirm]}
                            onPress={handleScheduleNotification}
                            disabled={scheduling}
                        >
                            {scheduling ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={[styles.modalButtonText, styles.modalButtonConfirmText]}>Запланировать</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    // Секция с запланированными уведомлениями
    const renderScheduledNotifications = () => {
        if (scheduledNotifications.length === 0) return null;

        const showingAll = scheduledNotifications.length > 5 && scheduledNotifications.length === totalNotifications;
        const showShowAllButton = totalNotifications > 5 && !showingAll;

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>📅 Запланированные обследования</Text>
                    {totalNotifications > 5 && (
                        <Text style={styles.notificationsCounter}>
                            Показано {scheduledNotifications.length} из {totalNotifications}
                        </Text>
                    )}
                </View>

                <View style={styles.notificationsContainer}>
                    {scheduledNotifications.map((notification) => {

                        return (
                            <View key={notification.id} style={styles.notificationCard}>
                                <View style={styles.notificationHeader}>
                                    <View style={styles.notificationDateContainer}>
                                        <Ionicons
                                            name="notifications-outline"
                                            size={16}
                                            color="#4CAF50"
                                            style={styles.notificationIcon}
                                        />
                                        <Text style={styles.notificationDate}>
                                            {formatNotificationDate(notification.nextCheckupDate)}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteNotification(notification.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#F44336" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Кнопка "Показать все" если уведомлений больше 5 */}
                {showShowAllButton && (
                    <TouchableOpacity
                        style={styles.showAllButton}
                        onPress={showAllNotifications}
                    >
                        <Text style={styles.showAllText}>Показать все напоминания</Text>
                        <Ionicons name="chevron-down" size={16} color="#1E88E5" />
                    </TouchableOpacity>
                )}

                {/* Кнопка "Свернуть" если показаны все уведомления */}
                {showingAll && (
                    <TouchableOpacity
                        style={styles.collapseButton}
                        onPress={collapseNotifications}
                    >
                        <Text style={styles.collapseText}>Свернуть</Text>
                        <Ionicons name="chevron-up" size={16} color="#666" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Кнопки действий
    const renderActionButtons = () => (
        <View style={styles.actionsContainer}>
            {user?.role === 'doctor' && report?.patientId && (
                <TouchableOpacity
                    style={[styles.actionButton, styles.scheduleButton]}
                    onPress={() => setShowNotificationModal(true)}
                >
                    <Ionicons name="notifications" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Запланировать обследование</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => {
                    Alert.alert('В разработке', 'Функция экспорта в разработке');
                }}
            >
                <Ionicons name="share" size={20} color="#1E88E5" />
                <Text style={styles.secondaryButtonText}>Поделиться отчётом</Text>
            </TouchableOpacity>
        </View>
    );

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
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>📄 Детальный отчёт</Text>
                {/* Основная информация */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Основная информация</Text>

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
                    <Text style={styles.sectionTitle}>Результаты расчёта</Text>

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
                            <Text style={[styles.resultValue]}>
                                {report.burnSeverity}
                            </Text>
                            <Text style={styles.resultDescription}>
                                Степень тяжести
                            </Text>
                        </View>

                        <View style={styles.resultCard}>
                            <Text style={styles.resultLabel}>Прогноз</Text>
                            <Text style={[styles.resultValue]}>
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
                        <Text style={styles.sectionTitle}>Поражённые зоны ({report.zones.length})</Text>

                        <View style={styles.zonesContainer}>
                            {report.zones.map((zone: CalculationZone, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.zoneCard,
                                        expandedZones[index] && styles.zoneCardExpanded
                                    ]}
                                    onPress={() => {
                                        const newExpanded = [...expandedZones];
                                        newExpanded[index] = !newExpanded[index];
                                        setExpandedZones(newExpanded);
                                    }}
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

                {/* Добавляем секцию уведомлений */}
                {renderScheduledNotifications()}

                {/* Кнопки действий */}
                {renderActionButtons()}
            </ScrollView>

            {/* Модальное окно для уведомлений */}
            {renderNotificationModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E88E5',
        flex: 1,
        textAlign: 'center',
        marginTop: 15,
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
    backButton: {
        backgroundColor: '#1E88E5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
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
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scheduleButton: {
        backgroundColor: '#4CAF50',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#1E88E5',
    },
    secondaryButtonText: {
        color: '#1E88E5',
        fontSize: 16,
        fontWeight: '600',
    },

    // Стили для модального окна
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '90%',
        maxHeight: '80%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
    modalLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        marginTop: 16,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 14,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    datePickerText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    notificationNote: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 16,
        marginBottom: 30,
        textAlign: 'center',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: '#f0f0f0',
    },
    modalButtonCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    modalButtonConfirm: {
        backgroundColor: '#1E88E5',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalButtonConfirmText: {
        color: '#fff',
    },

    // Стили для уведомлений
    notificationsContainer: {
        gap: 10,
    },
    notificationCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    notificationDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    notificationsCounter: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    notificationDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    notificationIcon: {
        marginRight: 8,
    },
    deleteButton: {
        padding: 4,
    },
    timeIndicator: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    timeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    showAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#f0f7ff',
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    showAllText: {
        color: '#1E88E5',
        fontSize: 14,
        fontWeight: '500',
    },
    collapseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    collapseText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
});