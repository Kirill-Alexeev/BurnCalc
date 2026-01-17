export type BurnDegree = 1 | 2 | 3 | 4;
export type BurnFraction = 0 | 0.5 | 1;

export interface BurnPartState {
    partId: string;
    fraction: BurnFraction;
    degree: BurnDegree;
}
