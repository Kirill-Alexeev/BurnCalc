import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Patient {
    id: string;
    name: string;
    phone?: string;
    email?: string;
}

interface PatientSearchProps {
    patients: Patient[];
    selectedPatientId: string | null;
    onSelectPatient: (patientId: string | null) => void;
}

export default function PatientSearch({ patients, selectedPatientId, onSelectPatient }: PatientSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPatients([]);
        } else {
            const filtered = patients.filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (patient.phone && patient.phone.includes(searchQuery)) ||
                (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredPatients(filtered.slice(0, 5)); // Ограничиваем 5 результатами
        }
    }, [searchQuery, patients]);

    const handleSelectPatient = (patient: Patient) => {
        onSelectPatient(patient.id);
        setSearchQuery(patient.name);
        setShowDropdown(false);
    };

    const clearSelection = () => {
        onSelectPatient(null);
        setSearchQuery('');
        setShowDropdown(false);
    };

    const getSelectedPatientName = () => {
        if (!selectedPatientId) return '';
        const patient = patients.find(p => p.id === selectedPatientId);
        return patient?.name || '';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Поиск пациента:</Text>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Введите имя пациента..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setShowDropdown(true)}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {selectedPatientId && (
                    <TouchableOpacity
                        style={styles.selectedPatientBadge}
                        onPress={clearSelection}
                    >
                        <Text style={styles.selectedPatientName}>
                            {getSelectedPatientName()}
                        </Text>
                        <Ionicons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            {showDropdown && filteredPatients.length > 0 && (
                <View style={styles.dropdown}>
                    {filteredPatients.map((patient) => (
                        <TouchableOpacity
                            key={patient.id}
                            style={styles.dropdownItem}
                            onPress={() => handleSelectPatient(patient)}
                        >
                            <View style={styles.patientInfo}>
                                <Text style={styles.patientName}>{patient.name}</Text>
                                {patient.phone && (
                                    <Text style={styles.patientDetail}>📱 {patient.phone}</Text>
                                )}
                            </View>
                            {selectedPatientId === patient.id && (
                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    searchContainer: {
        position: 'relative',
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        padding: 4,
    },
    selectedPatientBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E88E5',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 8,
        alignSelf: 'flex-start',
        gap: 6,
    },
    selectedPatientName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    patientDetail: {
        fontSize: 13,
        color: '#666',
    },
    selectedInfo: {
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    selectedInfoText: {
        fontSize: 14,
        color: '#1976D2',
    },
    selectedInfoName: {
        fontWeight: '600',
    },
});