import { db } from '../sqlite';

export interface PatientEntity {
    id: string;
    doctorId: string;
    fullName?: string;
    phone?: string;
    address?: string;
    createdAt: number;
}

export async function insertPatient(patient: PatientEntity) {
    await db.runAsync(
        `INSERT INTO patients 
        (id, doctorId, fullName, phone, address, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            patient.id,
            patient.doctorId,
            patient.fullName ?? null,
            patient.phone ?? null,
            patient.address ?? null,
            patient.createdAt,
        ]
    );
}

export async function getPatientsByDoctor(doctorId: string): Promise<PatientEntity[]> {
    return await db.getAllAsync(
        `SELECT * FROM patients WHERE doctorId = ? ORDER BY createdAt DESC`,
        [doctorId]
    );
}

export async function getPatientById(id: string): Promise<PatientEntity | null> {
    try {
        const result = await db.getAllAsync<PatientEntity>(
            `SELECT * FROM patients WHERE id = ?`,
            [id]
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Error getting patient by id:', error);
        return null;
    }
}
