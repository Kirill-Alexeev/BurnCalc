import { firestore } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { CalculationEntity } from '../../models/calculation';

export async function uploadCalculation(
    userId: string,
    calc: CalculationEntity
) {
    await setDoc(
        doc(firestore, 'users', userId, 'calculations', calc.id),
        calc
    );
}
