import { db } from '../sqlite';
import { CalculationEntity } from '../../models/Calculation';

export async function insertCalculation(calc: CalculationEntity): Promise<void> {
    await db.runAsync(
        `INSERT INTO calculations 
        (id, ageGroup, zones, totalTBSA, itp, burnSeverity, prognosis, createdAt, synced)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            calc.id,
            calc.ageGroup,
            JSON.stringify(calc.zones),
            calc.totalTBSA,
            calc.itp,
            calc.burnSeverity,
            calc.prognosis,
            calc.createdAt,
            calc.synced,
        ]
    );
}

export async function getUnsyncedCalculations(): Promise<CalculationEntity[]> {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM calculations WHERE synced = 0`
    );

    return result.map(r => ({
        ...r,
        zones: JSON.parse(r.zones),
    }));
}

export async function markAsSynced(id: string) {
    await db.runAsync(
        `UPDATE calculations SET synced = 1 WHERE id = ?`,
        [id]
    );
}
