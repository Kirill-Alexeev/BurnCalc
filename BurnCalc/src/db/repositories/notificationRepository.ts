import { db } from '../sqlite';
import { NotificationSchedule } from '../../models/notificationModel';

export async function insertNotificationSchedule(schedule: NotificationSchedule) {
    await db.runAsync(
        `INSERT INTO notification_schedules 
        (id, doctorId, patientId, calculationId, patientName, nextCheckupDate, 
         isActive, createdAt, lastNotified, notificationId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            schedule.id,
            schedule.doctorId,
            schedule.patientId,
            schedule.calculationId,
            schedule.patientName,
            schedule.nextCheckupDate,
            schedule.isActive ? 1 : 0,
            schedule.createdAt,
            schedule.lastNotified ?? null,
            schedule.notificationId ?? null,
        ]
    );
}

export async function getNotificationSchedulesByDoctor(doctorId: string): Promise<NotificationSchedule[]> {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM notification_schedules 
         WHERE doctorId = ? AND isActive = 1
         ORDER BY nextCheckupDate ASC`,
        [doctorId]
    );

    return result.map(r => ({
        ...r,
        isActive: Boolean(r.isActive),
    }));
}

export async function getNotificationScheduleById(id: string): Promise<NotificationSchedule | null> {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM notification_schedules WHERE id = ?`,
        [id]
    );
    return result.length > 0 ? { ...result[0], isActive: Boolean(result[0].isActive) } : null;
}

export async function updateNotificationSchedule(id: string, updates: Partial<NotificationSchedule>) {
    const fields = [];
    const values = [];

    if (updates.nextCheckupDate !== undefined) {
        fields.push('nextCheckupDate = ?');
        values.push(updates.nextCheckupDate);
    }
    if (updates.isActive !== undefined) {
        fields.push('isActive = ?');
        values.push(updates.isActive ? 1 : 0);
    }
    if (updates.lastNotified !== undefined) {
        fields.push('lastNotified = ?');
        values.push(updates.lastNotified);
    }
    if (updates.notificationId !== undefined) {
        fields.push('notificationId = ?');
        values.push(updates.notificationId);
    }

    if (fields.length === 0) return;

    values.push(id);

    await db.runAsync(
        `UPDATE notification_schedules SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
}

export async function deleteNotificationSchedule(id: string) {
    await db.runAsync(
        `DELETE FROM notification_schedules WHERE id = ?`,
        [id]
    );
}

export async function getUpcomingNotifications(doctorId: string, limit = 10): Promise<NotificationSchedule[]> {
    const now = Date.now();
    const result = await db.getAllAsync<any>(
        `SELECT * FROM notification_schedules 
         WHERE doctorId = ? AND isActive = 1 AND nextCheckupDate > ?
         ORDER BY nextCheckupDate ASC
         LIMIT ?`,
        [doctorId, now, limit]
    );

    return result.map(r => ({
        ...r,
        isActive: Boolean(r.isActive),
    }));
}