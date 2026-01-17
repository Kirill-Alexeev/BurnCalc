import { getUnsyncedCalculations, markAsSynced } from '../db/repositories/calculationRepository';
import { uploadCalculation } from '../services/firebase/calculationRemote';
import { isOnline } from '../utils/network';
import { auth, firestore } from '../services/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function syncCalculations() {
  if (!(await isOnline())) return;
  if (!auth.currentUser) return;

  const currentUserId = auth.currentUser.uid;

  // Получаем роль текущего пользователя
  const userDoc = await getDoc(doc(firestore, 'users', currentUserId));
  const role = userDoc.data()?.role;

  const unsynced = await getUnsyncedCalculations();

  for (const calc of unsynced) {
    try {
      if (role === 'patient') {
        // Пациент сохраняет только себе
        await uploadCalculation(calc);
      } else if (role === 'doctor') {
        // Врач сохраняет расчёт для пациента
        if (!calc.patientId) {
          console.warn(`Пропущен patientId для расчёта ${calc.id}`);
          continue;
        }
        await uploadCalculation(calc, calc.patientId);
      }
      await markAsSynced(calc.id);
    } catch (e: any) {
      console.error('Ошибка синхронизации расчёта', calc.id, e.message);
    }
  }
}
