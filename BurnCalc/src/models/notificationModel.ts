export interface NotificationSchedule {
    id: string;
    doctorId: string;
    patientId: string;
    calculationId: string;
    patientName: string;
    nextCheckupDate: number; // timestamp
    isActive: boolean;
    createdAt: number;
    lastNotified?: number;
    notificationId?: string; // ID пуш-уведомления
}

export type NotificationType = 'checkup_reminder' | 'follow_up';