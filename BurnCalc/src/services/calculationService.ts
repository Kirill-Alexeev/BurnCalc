import { CalculationResult, BurnZoneCalculation } from '../models/Calculation';
import { getBurnSeverity, getBurnPrognosis } from '../utils/severity';

export function calculateResult(
    zones: BurnZoneCalculation[],
): CalculationResult {
    let total = 0;
    let surface = 0;
    let deep = 0;

    zones.forEach(zone => {
        total += zone.percent;

        if (zone.degree === 1 || zone.degree === 2) {
            surface += zone.percent;
        } else {
            deep += zone.percent;
        }
    });

    const itp = surface * 1 + deep * 3;

    return {
        totalTBSA: Number(total.toFixed(1)),
        surfaceTBSA: Number(surface.toFixed(1)),
        deepTBSA: Number(deep.toFixed(1)),
        itp: Number(itp.toFixed(1)),
        severity: getBurnSeverity(itp),
        prognosis: getBurnPrognosis(itp)
    };
}
