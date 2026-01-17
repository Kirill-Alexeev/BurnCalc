import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from './firebase';

export async function savePatientWithCalculation(
    doctorId: string,
    patient: { id: string; name: string; phone: string; address: string },
    calculation: any
) {
    // Путь должен быть: 'doctorPatients/doctorId/patients/patientId'
    const patientRef = doc(
        firestore,
        'doctorPatients',  // коллекция
        doctorId,          // документ врача
        'patients',        // подколлекция пациентов
        patient.id         // документ пациента
    );

    // Сохраняем пациента
    await setDoc(
        patientRef,
        {
            ...patient,
            createdAt: Date.now(),
        }
    );

    // Сохраняем расчёт в подколлекцию пациента
    const calculationRef = doc(
        firestore,
        'doctorPatients',     // коллекция
        doctorId,             // документ врача
        'patients',           // подколлекция пациентов
        patient.id,           // документ пациента
        'calculations',       // подколлекция расчётов
        calculation.id        // документ расчёта
    );

    await setDoc(
        calculationRef,
        calculation
    );
}

export async function getDoctorPatients(doctorId: string) {
    // Правильный путь: doctorPatients/doctorId/patients
    const patientsRef = collection(
        firestore,
        'doctorPatients',  // коллекция
        doctorId,          // документ врача
        'patients'         // подколлекция пациентов
    );

    const snap = await getDocs(patientsRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function attachCalculationToPatient(
    doctorId: string,
    patientId: string,
    calculation: any
) {
    const calculationRef = doc(
        firestore,
        'doctorPatients',     // коллекция
        doctorId,             // документ врача
        'patients',           // подколлекция пациентов
        patientId,            // документ пациента
        'calculations',       // подколлекция расчётов
        calculation.id        // документ расчёта
    );

    await setDoc(
        calculationRef,
        calculation
    );
}