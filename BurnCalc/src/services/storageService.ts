import { generateUUID } from '../utils/uuid';
import { CalculationEntity } from '../models/Calculation';
import { insertCalculation } from '../db/repositories/calculationRepository';
import { syncCalculations } from './syncService';

export async function saveCalculation(
    userId: string,
    data: Omit<CalculationEntity, 'id' | 'createdAt' | 'synced'>
) {
    const calc: CalculationEntity = {
        ...data,
        id: generateUUID(),
        createdAt: Date.now(),
        synced: 0,
    };

    await insertCalculation(calc);
    await syncCalculations(userId);
}
