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
        path = doc(firestore, 'patients', patientId, 'calculations', calc.id);
    } else {
        throw new Error('Неизвестная роль пользователя');
    }

    await setDoc(path, calc);
}
