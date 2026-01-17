export function getBurnSeverity(itp: number): string {
    if (itp > 90) return 'Крайне тяжёлые ожоги';
    if (itp > 60) return 'Тяжёлые ожоги';
    if (itp > 30) return 'Ожоги средней тяжести';
    return 'Лёгкие ожоги';
}

export function getBurnPrognosis(itp: number): string {
    if (itp > 90) return 'Неблагоприятный';
    if (itp > 60) return 'Сомнительный';
    if (itp > 30) return 'Относительно благоприятный';
    return 'Благоприятный';
}