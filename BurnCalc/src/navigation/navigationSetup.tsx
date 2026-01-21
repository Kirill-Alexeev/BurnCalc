import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Определяем типы для навигации
type RootStackParamList = {
    DoctorApp: undefined;
    PatientApp: undefined;
    Calculator: {
        patientId?: string;
        patientName?: string;
    };
    // ... другие экраны
};

export function useNotificationNavigation() {
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    useEffect(() => {
        // Обработка уведомлений при нажатии
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data as any;
        });

        // Обработка уведомлений при получении (опционально)
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Уведомление получено:', notification);
        });

        return () => {
            if (responseListener.current) {
                responseListener.current.remove();
            }
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
        };
    }, []);
}