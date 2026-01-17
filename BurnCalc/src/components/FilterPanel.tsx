import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

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

    const updateFilter = (key: keyof FilterOptions, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {};
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowFilters(!showFilters)}
            >
                <Text style={styles.toggleButtonText}>
                    {showFilters ? '▲ Скрыть фильтры' : '▼ Показать фильтры'}
                </Text>
            </TouchableOpacity>

            {showFilters && (
                <View style={styles.filtersContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Фильтрация</Text>
                        {hasActiveFilters && (
                            <TouchableOpacity onPress={clearFilters}>
                                <Text style={styles.clearButton}>Сбросить</Text>
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
                        <Text style={styles.label}>Дата (ГГГГ-ММ-ДД)</Text>
                        <View style={styles.dateRow}>
                            <TextInput
                                style={[styles.input, styles.dateInput]}
                                placeholder="От"
                                value={filters.dateFrom || ''}
                                onChangeText={(text) => updateFilter('dateFrom', text)}
                            />
                            <Text style={styles.separator}>—</Text>
                            <TextInput
                                style={[styles.input, styles.dateInput]}
                                placeholder="До"
                                value={filters.dateTo || ''}
                                onChangeText={(text) => updateFilter('dateTo', text)}
                            />
                        </View>
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
    },
    filtersContainer: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    clearButton: {
        color: '#1E88E5',
        fontSize: 14,
        fontWeight: '600',
    },
    filterGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#f9f9f9',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateInput: {
        flex: 1,
    },
    rangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rangeInput: {
        flex: 1,
        textAlign: 'center',
    },
    separator: {
        marginHorizontal: 8,
        color: '#888',
        fontSize: 16,
    },
});