export type BurnDegree = 1 | 2 | 3 | 4;

export interface BurnZoneCalculation {
    zoneId: string;
    zoneName: string;
    percent: number;
    degree: BurnDegree;
}

export interface CalculationResult {
    totalTBSA: number;
    surfaceTBSA: number;
    deepTBSA: number;
    itp: number;
    severity: string;
    prognosis: string;
}
