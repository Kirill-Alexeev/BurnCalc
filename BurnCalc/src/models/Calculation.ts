import { AgeGroup, BodyPart } from '../utils/ageCoefficients';
import { BurnDegree, BurnFraction } from './burnInput';

export interface CalculationZone {
    bodyPart: BodyPart;
    fraction: BurnFraction;
    degree: BurnDegree;
    percent: number;
}

export interface CalculationEntity {
    id: string;
    ageGroup: AgeGroup;
    zones: CalculationZone[];
    totalTBSA: number;
    itp: number;
    burnSeverity: string;
    prognosis: string;
    createdAt: number;
    synced: 0 | 1;
    patientId?: string;
}