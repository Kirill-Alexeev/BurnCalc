export const BODY_PARTS = [
    { id: 'head', name: 'Голова' },
    { id: 'front', name: 'Грудная клетка и живот' },
    { id: 'back', name: 'Спина' },
    { id: 'left_arm', name: 'Левая рука' },
    { id: 'right_arm', name: 'Правая рука' },
    { id: 'left_leg', name: 'Левая нога' },
    { id: 'right_leg', name: 'Правая нога' },
    { id: 'perineum', name: 'Промежность' },
] as const;

export type BodyPartId = typeof BODY_PARTS[number]['id'];