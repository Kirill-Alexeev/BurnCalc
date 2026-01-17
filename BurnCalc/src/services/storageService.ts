import { insertCalculation, markAsSynced } from '../db/repositories/calculationRepository';
import { uploadCalculation } from './firebase/calculationRemote';
import { CalculationEntity } from '../models/Calculation';
import { isOnline } from '../utils/network';
import { auth } from './firebase/firebase';

export async function saveCalculation(
    calc: CalculationEntity,
    userId?: string,
    doctorId?: string,
    patientId?: string
) {
    try {
        // 1. Сохраняем локально с информацией о пользователе
        await insertCalculation(calc, userId, doctorId, patientId);

        // 2. Если есть интернет — синхронизируем
        if (await isOnline()) {
            const currentUserId = auth.currentUser?.uid;
            if (!currentUserId) return true;

            await uploadCalculation(calc, patientId || userId);
            await markAsSynced(calc.id);
        }

        return true;
    } catch (e) {
        console.log('Ошибка при сохранении расчёта:', e);
        return false;
    }
}