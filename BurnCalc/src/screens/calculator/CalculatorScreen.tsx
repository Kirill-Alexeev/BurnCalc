import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useMemo, useState } from 'react';
import {
    AGE_GROUPS,
    AGE_COEFFICIENTS,
    AgeGroup,
    BodyPart,
    BODY_PARTS,
} from '../../utils/ageCoefficients';
import { BurnDegree, BurnFraction } from '../../models/burnInput';
import { calculateResult } from '../../services/calculationService';
import {
    AGE_GROUP_LABELS,
    BODY_PART_LABELS,
} from '../../utils/labels';

const DEGREE_LABELS: Record<BurnDegree, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
};

export default function CalculatorScreen() {
    const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
    const [parts, setParts] = useState<
        Record<BodyPart, { fraction: BurnFraction; degree: BurnDegree }>
    >({} as any);

    const zones = useMemo(() => {
        return BODY_PARTS.map(part => {
            const state = parts[part];
            if (!state || state.fraction === 0) return null;

            return {
                zoneId: part,
                zoneName: BODY_PART_LABELS[part],
                percent: AGE_COEFFICIENTS[ageGroup][part] * state.fraction,
                degree: state.degree,
            };
        }).filter(Boolean) as any[];
    }, [parts, ageGroup]);

    const result = calculateResult(zones);

    const setFraction = (part: BodyPart, fraction: BurnFraction) => {
        setParts(prev => ({
            ...prev,
            [part]: { fraction, degree: prev[part]?.degree ?? 1 },
        }));
    };

    const setDegree = (part: BodyPart, degree: BurnDegree) => {
        setParts(prev => ({
            ...prev,
            [part]: { fraction: prev[part]?.fraction ?? 0, degree },
        }));
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.title}>Калькулятор ожогов</Text>

            {/* Возраст */}
            <Text style={styles.sectionTitle}>Возраст пациента</Text>
            <View style={styles.selector}>
                {AGE_GROUPS.map(g => (
                    <SelectorItem
                        key={g}
                        label={AGE_GROUP_LABELS[g]}
                        active={ageGroup === g}
                        onPress={() => setAgeGroup(g)}
                    />
                ))}
            </View>

            {/* Части тела */}
            {BODY_PARTS.map(part => {
                const max = AGE_COEFFICIENTS[ageGroup][part];

                return (
                    <View key={part} style={styles.partBlock}>
                        <Text style={styles.partTitle}>
                            {BODY_PART_LABELS[part]}
                        </Text>

                        <Text style={styles.label}>Площадь ожога</Text>
                        <View style={styles.selector}>
                            {[0, 0.5, 1].map(v => (
                                <SelectorItem
                                    key={v}
                                    label={
                                        v === 0
                                            ? '0%'
                                            : `${(max * v).toFixed(1)}%`
                                    }
                                    active={parts[part]?.fraction === v}
                                    onPress={() => setFraction(part, v as BurnFraction)}
                                />
                            ))}
                        </View>

                        <Text style={styles.label}>Степень тяжести</Text>
                        <View style={styles.selector}>
                            {[1, 2, 3, 4].map(d => (
                                <SelectorItem
                                    key={d}
                                    label={DEGREE_LABELS[d as BurnDegree]}
                                    active={parts[part]?.degree === d}
                                    onPress={() => setDegree(part, d as BurnDegree)}
                                />
                            ))}
                        </View>
                    </View>
                );
            })}

            {zones.length > 0 && (
                <View style={styles.result}>
                    <Text>Общая ПОТ: {result.totalTBSA}%</Text>
                    <Text>ИТП: {result.itp}</Text>
                    <Text>Тяжесть: {result.severity}</Text>
                    <Text>Прогноз: {result.prognosis}</Text>
                </View>
            )}
        </ScrollView>
    );
}

/* ===== UI ===== */

function SelectorItem({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.selectorItem,
                active && styles.selectorItemActive,
            ]}
        >
            <Text style={{ color: active ? '#fff' : '#000', fontWeight: '600' }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = {
    title: {
        fontSize: 22,
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    partBlock: {
        marginTop: 24,
    },
    partTitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        color: '#555',
        marginTop: 8,
        marginBottom: 4,
    },
    selector: {
        flexDirection: 'row' as const,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden' as const,
    },
    selectorItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center' as const,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    selectorItemActive: {
        backgroundColor: '#1E88E5',
    },
    result: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
    },
};
