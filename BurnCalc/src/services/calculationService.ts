import { CalculationZone, CalculationEntity } from '../models/Calculation';
import { AgeGroup } from '../utils/ageCoefficients';
import { getBurnSeverity, getBurnPrognosis } from '../utils/severity';

export function calculateResult(
    zones: CalculationZone[],
    ageGroup: AgeGroup
): CalculationEntity {
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
    const now = Date.now();

    return {
        id: `calc_${now}`,            // без crypto / uuid — не упадёт
        ageGroup,
        zones,
        totalTBSA: Number(total.toFixed(1)),
        itp: Number(itp.toFixed(1)),
        burnSeverity: getBurnSeverity(itp),
        prognosis: getBurnPrognosis(itp),
        createdAt: now,
        synced: 0,
    };
}
