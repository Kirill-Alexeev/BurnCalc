import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function InfoScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>📚 Информация об ожогах</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Правило девяток Уоллеса</Text>
                <Text style={styles.text}>
                    Метод быстрой оценки площади ожогов у взрослых:
                </Text>

                <View style={styles.list}>
                    <Text style={styles.listItem}>• Голова и шея: 9%</Text>
                    <Text style={styles.listItem}>• Передняя поверхность туловища: 18%</Text>
                    <Text style={styles.listItem}>• Задняя поверхность туловища: 18%</Text>
                    <Text style={styles.listItem}>• Каждая верхняя конечность: 9%</Text>
                    <Text style={styles.listItem}>• Каждая нижняя конечность: 18%</Text>
                    <Text style={styles.listItem}>• Промежность: 1%</Text>
                </View>

                <Text style={styles.note}>
                    У детей пропорции отличаются: голова — до 20%, ноги и туловище — меньше.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Степени тяжести ожогов</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>I степень</Text>
                    <Text style={styles.cardText}>Поверхностное поражение эпидермиса. Покраснение, отёк, боль. Заживает за 3-6 дней.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>II степень</Text>
                    <Text style={styles.cardText}>Поражение эпидермиса и частично дермы. Пузыри с серозным содержимым. Заживает за 2-3 недели.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>III степень</Text>
                    <Text style={styles.cardText}>Поражение всех слоёв кожи. Сухой струп, отсутствие боли. Требует хирургического лечения.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>IV степень</Text>
                    <Text style={styles.cardText}>Поражение кожи, подкожной клетчатки, мышц, костей. Обугливание тканей.</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Индекс тяжести поражения (ИТП)</Text>
                <Text style={styles.text}>
                    ИТП = (1% поверхностных ожогов) × 1 + (1% глубоких ожогов) × 3
                </Text>
                <Text style={styles.text}>
                    Критерии тяжести:
                </Text>
                <View style={styles.list}>
                    <Text style={styles.listItem}>• Лёгкий ожог: ИТП менее 30</Text>
                    <Text style={styles.listItem}>• Средней тяжести: ИТП 30-60</Text>
                    <Text style={styles.listItem}>• Тяжёлый: ИТП 61-90</Text>
                    <Text style={styles.listItem}>• Крайне тяжёлый: ИТП более 90</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Прогноз по Франку</Text>
                <Text style={styles.text}>
                    Летальность (%) = (Возраст + ИТП) / 100
                </Text>
                <Text style={styles.text}>
                    Прогностические индексы:
                </Text>
                <View style={styles.list}>
                    <Text style={styles.listItem}>• До 30% — благоприятный прогноз</Text>
                    <Text style={styles.listItem}>• 30-60% — сомнительный</Text>
                    <Text style={styles.listItem}>• Более 60% — неблагоприятный</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Информация предоставлена для медицинских работников.
                    Все решения должны приниматься квалифицированными специалистами.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
        color: '#1E88E5',
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 8,
    },
    list: {
        marginLeft: 16,
        marginVertical: 8,
    },
    listItem: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 4,
    },
    note: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        marginTop: 8,
    },
    card: {
        backgroundColor: '#f0f7ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#1E88E5',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#1E88E5',
    },
    cardText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 18,
    },
    footer: {
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 30,
    },
    footerText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#546E7A',
        textAlign: 'center',
        lineHeight: 18,
    },
});