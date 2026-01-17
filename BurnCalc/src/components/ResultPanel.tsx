import { View, Text } from 'react-native';
import { CalculationResult } from '../models/Calculation';

export default function ResultPanel({ result }: { result: CalculationResult }) {
    return (
        <View>
            <Text>Общая ПОТ: {result.totalTBSA}%</Text>
            <Text>ИТП: {result.itp}</Text>
            <Text>Тяжесть: {result.severity}</Text>
        </View>
    );
}
