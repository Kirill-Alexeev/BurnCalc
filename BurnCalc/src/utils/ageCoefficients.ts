export type AgeGroup =
    | 'infant'
    | 'child1to4'
    | 'child5to14'
    | 'adult';

export const AGE_GROUPS: AgeGroup[] = ['infant', 'child1to4', 'child5to14', 'adult'];

export const BODY_PARTS = [
    'head',
    'front',
    'back',
    'left_arm',
    'right_arm',
    'left_leg',
    'right_leg',
    'perineum',
] as const;

export type BodyPart = typeof BODY_PARTS[number];

export const AGE_COEFFICIENTS: Record<AgeGroup, Record<BodyPart, number>> = {
    'infant': {
        head: 20,
        front: 16,
        back: 16,
        left_arm: 9,
        right_arm: 9,
        left_leg: 14.5,
        right_leg: 14.5,
        perineum: 1,
    },
    'child1to4': {
        head: 16,
        front: 17.5,
        back: 17.5,
        left_arm: 9,
        right_arm: 9,
        left_leg: 16,
        right_leg: 16,
        perineum: 1,
    },
    'child5to14': {
        head: 11,
        front: 18,
        back: 18,
        left_arm: 9,
        right_arm: 9,
        left_leg: 17,
        right_leg: 17,
        perineum: 1,
    },
    'adult': {
        head: 9,
        front: 18,
        back: 18,
        left_arm: 9,
        right_arm: 9,
        left_leg: 18,
        right_leg: 18,
        perineum: 1,
    },
};
