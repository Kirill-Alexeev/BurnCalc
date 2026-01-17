import { db } from './sqlite';

export async function runMigrations() {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY NOT NULL,
            doctorId TEXT NOT NULL,
            fullName TEXT,
            phone TEXT,
            address TEXT,
            createdAt INTEGER NOT NULL
        );
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS calculations (
            id TEXT PRIMARY KEY NOT NULL,
            userId TEXT,
            doctorId TEXT,
            patientId TEXT,
            ageGroup TEXT NOT NULL,
            zones TEXT NOT NULL,
            totalTBSA REAL NOT NULL,
            itp REAL NOT NULL,
            burnSeverity TEXT NOT NULL,
            prognosis TEXT NOT NULL,
            createdAt INTEGER NOT NULL,
            synced INTEGER NOT NULL
        );
    `);
}
