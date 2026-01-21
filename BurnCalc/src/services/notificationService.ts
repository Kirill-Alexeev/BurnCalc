import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { insertNotificationSchedule, getNotificationSchedulesByDoctor, updateNotificationSchedule } from '../db/repositories/notificationRepository';
import { generateUUID } from '../utils/uuid';
import { NotificationSchedule } from '../models/notificationModel';
import Constants from 'expo-constants';

// Проверяем, находимся ли в Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Настройка уведомлений
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
    if (isExpoGo) {
        console.log('В Expo Go разрешения запрашиваются автоматически');
        return true;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status } = await Notifications.requestPermissionsAsync({
        ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
        },
    });
    return status === 'granted';
}

export async function scheduleCheckupNotification(
    doctorId: string,
    patientId: string,
    calculationId: string,
    patientName: string,
    checkupDate: Date
): Promise<string | null> {
    try {
        if (isExpoGo) {
            console.log('В Expo Go создается локальное уведомление');
        }

        // Отменяем старые уведомления для этого пациента
        await cancelPatientNotifications(patientId);

        // Рассчитываем timestamp для уведомления (за 1 час до обследования)
        const notificationTime = new Date(checkupDate);
        notificationTime.setMinutes(notificationTime.getMinutes() - 10);
        
        // Проверяем, не прошел ли уже срок
        if (notificationTime.getTime() < Date.now()) {
            console.log('Срок уведомления уже прошел');
            return null;
        }

        // Создаем триггер для уведомления
        const trigger: Notifications.DateTriggerInput = {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: notificationTime,
        };

        // Создаем уведомление
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: '💊 Напоминание о обследовании',
                body: `Пришло время обследования пациента: ${patientName}`,
                data: {
                    type: 'checkup_reminder',
                    patientId,
                    calculationId,
                    patientName,
                    doctorId,
                    screen: 'Calculator',
                },
                sound: true,
            },
            trigger,
        });

        // Создаем запись в расписании
        const scheduleId = generateUUID();
        const schedule: NotificationSchedule = {
            id: scheduleId,
            doctorId,
            patientId,
            calculationId,
            patientName,
            nextCheckupDate: checkupDate.getTime(),
            isActive: true,
            createdAt: Date.now(),
            notificationId,
        };

        await insertNotificationSchedule(schedule);

        console.log('Уведомление запланировано:', scheduleId);
        return scheduleId;
    } catch (error) {
        console.error('Ошибка при создании уведомления:', error);
        if (isExpoGo) {
            console.warn('Push-уведомления не поддерживаются в Expo Go. Используйте development build для полной функциональности.');
        }
        return null;
    }
}

export async function cancelPatientNotifications(patientId: string) {
    try {
        // Получаем все активные уведомления для пациента
        const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
        
        for (const notification of allNotifications) {
            const data = notification.content.data as any;
            if (data?.patientId === patientId) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        }
    } catch (error) {
        console.error('Ошибка при отмене уведомлений:', error);
    }
}

export async function cancelNotification(notificationId: string) {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.error('Ошибка при отмене уведомления:', error);
    }
}

export async function checkAndRescheduleNotifications(doctorId: string) {
    const schedules = await getNotificationSchedulesByDoctor(doctorId);
    const now = Date.now();

    for (const schedule of schedules) {
        // Если уведомление просрочено, но активно - деактивируем
        if (schedule.nextCheckupDate < now && schedule.isActive) {
            await updateNotificationSchedule(schedule.id, { isActive: false });
        }
    }
}

// Функция для получения всех активных уведомлений
export async function getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
}