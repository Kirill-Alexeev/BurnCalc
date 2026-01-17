import { getUnsyncedCalculations, markAsSynced } from '../db/repositories/calculationRepository';
import { uploadCalculation } from '../services/firebase/calculationRemote';
import { isOnline } from '../utils/network';

export async function syncCalculations(userId: string) {
    if (!(await isOnline())) return;

    const unsynced = await getUnsyncedCalculations();

    for (const calc of unsynced) {
        await uploadCalculation(userId, calc);
        markAsSynced(calc.id);
    }
}
