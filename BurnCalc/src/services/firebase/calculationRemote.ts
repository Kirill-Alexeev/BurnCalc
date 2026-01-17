import { firestore, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { CalculationEntity } from '../../models/Calculation';
import { getDoc } from 'firebase/firestore';

export async function uploadCalculation(calc: CalculationEntity, patientId?: string) {
    if (!auth.currentUser) throw new Error('Не авторизован');

    // Получаем роль текущего пользователя
    const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
    const role = userDoc.data()?.role;

    let path;

    if (role === 'patient') {
        // Пациент сохраняет только себе
        path = doc(firestore, 'users', auth.currentUser.uid, 'calculations', calc.id);
    } else if (role === 'doctor') {
        // Врач должен передать patientId
        if (!patientId) throw new Error('Для врача нужно указать patientId');

        // Проверяем, существует ли пациент у этого врача
        const doctorId = auth.currentUser.uid;
        const patientRef = doc(firestore, 'doctorPatients', doctorId, 'patients', patientId);
        const patientDoc = await getDoc(patientRef);

        if (!patientDoc.exists()) {
            throw new Error('Пациент не найден у этого врача');
        }

        // Сохраняем расчёт в подколлекцию пациента
        path = doc(
            firestore,
            'doctorPatients',  // коллекция
            doctorId,          // документ врача
            'patients',        // подколлекция пациентов
            patientId,         // документ пациента
            'calculations',    // подколлекция расчётов
            calc.id            // документ расчёта
        );
    } else {
        throw new Error('Неизвестная роль пользователя');
    }

    await setDoc(path, calc);
}