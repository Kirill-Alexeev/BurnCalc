import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            {/* Шапка с кнопками */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('Info')}
                >
                    <Text style={styles.headerButtonText}>ℹ️ Инфо</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Главная</Text>

                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.headerButtonText}>⚙️ Настройки</Text>
                </TouchableOpacity>
            </View>

            {/* Основной контент */}
            <ScrollView contentContainerStyle={styles.content}>
                {/* Логотип/Иконка приложения */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={{ width: 50, height: 75, marginBottom: 16 }}
                    />
                    <Text style={styles.appName}>BurnCalc</Text>
                    <Text style={styles.appSubtitle}>Калькулятор ожогов</Text>
                </View>

                {/* Краткая информация */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>О приложении</Text>
                    <Text style={styles.infoText}>
                        BurnCalc — это профессиональное медицинское приложение для оценки площади и тяжести ожогов.
                    </Text>
                    <Text style={styles.infoText}>
                        Используйте калькулятор для быстрого расчёта площади ожоговой травмы (ПОТ) и индекса тяжести поражения (ИТП) по правилу девяток.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    headerButtonText: {
        fontSize: 14,
        color: '#1E88E5',
    },
    content: {
        padding: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    logo: {
        fontSize: 60,
        marginBottom: 10,
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1E88E5',
        marginBottom: 4,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    infoText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 10,
    },
    featuresCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featuresTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 12,
        width: 40,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    actionsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionsTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#1E88E5',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    actionButtonIcon: {
        fontSize: 28,
        marginBottom: 8,
        color: '#fff',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});