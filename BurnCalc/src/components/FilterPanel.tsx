import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterPanelProps {
    userRole: 'doctor' | 'patient';
    onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
    patientName?: string;
    dateFrom?: string; // Формат YYYY-MM-DD
    dateTo?: string;
    minTBSA?: string;
    maxTBSA?: string;
    minITP?: string;
    maxITP?: string;
}

export default function FilterPanel({ userRole, onFilterChange }: FilterPanelProps) {
    const [filters, setFilters] = useState<FilterOptions>({});
    const [showFilters, setShowFilters] = useState(false);
    const [showDateFromPicker, setShowDateFromPicker] = useState(false);
    const [showDateToPicker, setShowDateToPicker] = useState(false);
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

    // Функция для форматирования даты в YYYY-MM-DD
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const updateFilter = (key: keyof FilterOptions, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleDateFromChange = (event: any, selectedDate?: Date) => {
        setShowDateFromPicker(false);
        if (selectedDate) {
            setDateFrom(selectedDate);
            const formattedDate = formatDate(selectedDate);
            updateFilter('dateFrom', formattedDate);
        }
    };

    const handleDateToChange = (event: any, selectedDate?: Date) => {
        setShowDateToPicker(false);
        if (selectedDate) {
            setDateTo(selectedDate);
            const formattedDate = formatDate(selectedDate);
            updateFilter('dateTo', formattedDate);
        }
    };

    const clearDateFrom = () => {
        setDateFrom(undefined);
        updateFilter('dateFrom', '');
    };

    const clearDateTo = () => {
        setDateTo(undefined);
        updateFilter('dateTo', '');
    };

    const clearFilters = () => {
        const clearedFilters = {};
        setFilters(clearedFilters);
        setDateFrom(undefined);
        setDateTo(undefined);
        onFilterChange(clearedFilters);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

    // Форматирование даты для отображения
    const formatDisplayDate = (date: Date | undefined): string => {
        if (!date) return 'Выберите дату';
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowFilters(!showFilters)}
            >
                <Text style={styles.toggleButtonText}>
                    {showFilters ? '▲ Скрыть фильтры' : '▼ Показать фильтры'}
                    {hasActiveFilters && ' ⚠️'}
                </Text>
            </TouchableOpacity>

            {showFilters && (
                <View style={styles.filtersContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Фильтрация</Text>
                        {hasActiveFilters && (
                            <TouchableOpacity onPress={clearFilters}>
                                <Text style={styles.clearButton}>Сбросить все</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {userRole === 'doctor' && (
                        <View style={styles.filterGroup}>
                            <Text style={styles.label}>Пациент</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Имя пациента"
                                value={filters.patientName || ''}
                                onChangeText={(text) => updateFilter('patientName', text)}
                            />
                        </View>
                    )}

                    <View style={styles.filterGroup}>
                        <Text style={styles.label}>Дата</Text>
                        
                        <View style={styles.dateRow}>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateLabel}>От:</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowDateFromPicker(true)}
                                >
                                    <Text style={[
                                        styles.dateButtonText,
                                        dateFrom && styles.dateButtonTextSelected
                                    ]}>
                                        {formatDisplayDate(dateFrom)}
                                    </Text>
                                </TouchableOpacity>
                                {dateFrom && (
                                    <TouchableOpacity
                                        style={styles.clearDateButton}
                                        onPress={clearDateFrom}
                                    >
                                        <Text style={styles.clearDateText}>✕</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateLabel}>До:</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowDateToPicker(true)}
                                >
                                    <Text style={[
                                        styles.dateButtonText,
                                        dateTo && styles.dateButtonTextSelected
                                    ]}>
                                        {formatDisplayDate(dateTo)}
                                    </Text>
                                </TouchableOpacity>
                                {dateTo && (
                                    <TouchableOpacity
                                        style={styles.clearDateButton}
                                        onPress={clearDateTo}
                                    >
                                        <Text style={styles.clearDateText}>✕</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* DateTimePicker для выбора даты */}
                        {showDateFromPicker && (
                            <DateTimePicker
                                value={dateFrom || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateFromChange}
                                maximumDate={dateTo || new Date()}
                            />
                        )}

                        {showDateToPicker && (
                            <DateTimePicker
                                value={dateTo || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateToChange}
                                minimumDate={dateFrom}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    <View style={styles.filterGroup}>
                        <Text style={styles.label}>ПОТ (%)</Text>
                        <View style={styles.rangeRow}>
                            <TextInput
                                style={[styles.input, styles.rangeInput]}
                                placeholder="Мин"
                                keyboardType="numeric"
                                value={filters.minTBSA || ''}
                                onChangeText={(text) => updateFilter('minTBSA', text)}
                            />
                            <Text style={styles.separator}>—</Text>
                            <TextInput
                                style={[styles.input, styles.rangeInput]}
                                placeholder="Макс"
                                keyboardType="numeric"
                                value={filters.maxTBSA || ''}
                                onChangeText={(text) => updateFilter('maxTBSA', text)}
                            />
                        </View>
                    </View>

                    <View style={styles.filterGroup}>
                        <Text style={styles.label}>ИТП</Text>
                        <View style={styles.rangeRow}>
                            <TextInput
                                style={[styles.input, styles.rangeInput]}
                                placeholder="Мин"
                                keyboardType="numeric"
                                value={filters.minITP || ''}
                                onChangeText={(text) => updateFilter('minITP', text)}
                            />
                            <Text style={styles.separator}>—</Text>
                            <TextInput
                                style={[styles.input, styles.rangeInput]}
                                placeholder="Макс"
                                keyboardType="numeric"
                                value={filters.maxITP || ''}
                                onChangeText={(text) => updateFilter('maxITP', text)}
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    toggleButton: {
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    toggleButtonText: {
        color: '#1E88E5',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 14,
    },
    filtersContainer: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    clearButton: {
        color: '#1E88E5',
        fontSize: 14,
        fontWeight: '600',
    },
    filterGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 10,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#f9f9f9',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    dateContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
        width: 25,
    },
    dateButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
    },
    dateButtonText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    dateButtonTextSelected: {
        color: '#333',
        fontWeight: '500',
    },
    clearDateButton: {
        marginLeft: 5,
    },
    clearDateText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    rangeInput: {
        flex: 1,
        textAlign: 'center',
    },
    separator: {
        color: '#888',
        fontSize: 16,
        fontWeight: '500',
    },
});