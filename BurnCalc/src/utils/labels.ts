import { AgeGroup, BodyPart } from './ageCoefficients';

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
    infant: '< 1 года',
    child1to4: '1–4 года',
    child5to14: '5–14 лет',
    adult: '> 15 лет',
};

export const BODY_PART_LABELS: Record<BodyPart, string> = {
    head: 'Голова',
    front: 'Передняя поверхность туловища',
    back: 'Задняя поверхность туловища',
    left_arm: 'Левая рука',
    right_arm: 'Правая рука',
    left_leg: 'Левая нога',
    right_leg: 'Правая нога',
    perineum: 'Промежность',
};
