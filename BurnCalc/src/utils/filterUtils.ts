// Вспомогательные функции для фильтрации

export function filterCalculations(
    calculations: any[],
    filters: {
        patientName?: string;
        dateFrom?: string;
        dateTo?: string;
        minTBSA?: string;
        maxTBSA?: string;
        minITP?: string;
        maxITP?: string;
    }
): any[] {
    return calculations.filter(calc => {
        // Фильтр по имени пациента
        if (filters.patientName && filters.patientName.trim() !== '') {
            if (!calc.patientName ||
                !calc.patientName.toLowerCase().includes(filters.patientName.toLowerCase())) {
                return false;
            }
        }

        // Фильтр по дате
        const calcDate = new Date(calc.createdAt);

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (calcDate < fromDate) return false;
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (calcDate > toDate) return false;
        }

        // Фильтр по ПОТ
        if (filters.minTBSA && filters.minTBSA.trim() !== '') {
            const min = parseFloat(filters.minTBSA);
            if (isNaN(min) || calc.totalTBSA < min) return false;
        }

        if (filters.maxTBSA && filters.maxTBSA.trim() !== '') {
            const max = parseFloat(filters.maxTBSA);
            if (isNaN(max) || calc.totalTBSA > max) return false;
        }

        // Фильтр по ИТП
        if (filters.minITP && filters.minITP.trim() !== '') {
            const min = parseFloat(filters.minITP);
            if (isNaN(min) || calc.itp < min) return false;
        }

        if (filters.maxITP && filters.maxITP.trim() !== '') {
            const max = parseFloat(filters.maxITP);
            if (isNaN(max) || calc.itp > max) return false;
        }

        return true;
    });
}

// Сортировка расчётов
export function sortCalculations(
    calculations: any[],
    sortBy: 'date' | 'tbsa' | 'itp' = 'date',
    ascending: boolean = false
): any[] {
    const sorted = [...calculations];

    sorted.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'date':
                comparison = b.createdAt - a.createdAt; // Новые сверху
                break;
            case 'tbsa':
                comparison = b.totalTBSA - a.totalTBSA;
                break;
            case 'itp':
                comparison = b.itp - a.itp;
                break;
        }

        return ascending ? -comparison : comparison;
    });

    return sorted;
}