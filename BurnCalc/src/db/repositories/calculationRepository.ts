import { db } from '../sqlite';
import { CalculationEntity } from '../../models/Calculation';

export async function insertCalculation(
    calc: CalculationEntity,
    userId?: string,
    doctorId?: string,
    patientId?: string
): Promise<void> {
    await db.runAsync(
        `INSERT INTO calculations 
        (id, userId, doctorId, patientId, ageGroup, zones, totalTBSA, itp, burnSeverity, prognosis, createdAt, synced)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            calc.id,
            userId ?? null,
            doctorId ?? null,
            patientId ?? null,
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

export async function getCalculationsByUserId(userId: string): Promise<CalculationEntity[]> {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM calculations WHERE userId = ? ORDER BY createdAt DESC`,
        [userId]
    );

    return result.map(r => ({
        ...r,
        zones: JSON.parse(r.zones),
    }));
}

export async function getCalculationsByDoctorId(doctorId: string): Promise<CalculationEntity[]> {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM calculations WHERE doctorId = ? ORDER BY createdAt DESC`,
        [doctorId]
    );

    return result.map(r => ({
        ...r,
        zones: JSON.parse(r.zones),
    }));
}

// Для совместимости со старым кодом
export async function getAllCalculations(): Promise<CalculationEntity[]> {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM calculations ORDER BY createdAt DESC`
    );

    return result.map(r => ({
        ...r,
        zones: JSON.parse(r.zones),
    }));
}

// Остальные методы остаются
export async function attachCalculationToPatient(
    calculationId: string,
    patientId: string
) {
    await db.runAsync(
        `UPDATE calculations SET patientId = ? WHERE id = ?`,
        [patientId, calculationId]
    );
}

export async function getUnsyncedCalculations(userId?: string): Promise<CalculationEntity[]> {
    let query = `SELECT * FROM calculations WHERE synced = 0`;
    const params: any[] = [];

    if (userId) {
        query += ` AND (userId = ? OR doctorId = ?)`;
        params.push(userId, userId);
    }

    const result = await db.getAllAsync<any>(query, params);

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