import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function SettingsScreen() {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert(
            'Выход',
            'Вы уверены, что хотите выйти из аккаунта?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: logout,
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚙️ Настройки</Text>
            
            {/* Профиль пользователя */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Профиль</Text>
                <View style={styles.profileInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.role === 'doctor' ? '👨‍⚕️' : '👤'}
                        </Text>
                    </View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.profileName}>
                            {user?.email || 'Пользователь'}
                        </Text>
                        <Text style={styles.profileRole}>
                            {user?.role === 'doctor' ? 'Врач' : 'Пациент'}
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* О приложении */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>О приложении</Text>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Версия приложения</Text>
                    <Text style={styles.menuValue}>1.0.0</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Связаться с поддержкой</Text>
                    <Text >+7 (951) 472-60-87</Text>
                </TouchableOpacity>
            </View>
            
            {/* Опасная зона */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Выйти из аккаунта</Text>
                
                <TouchableOpacity 
                    style={[styles.menuItem, styles.dangerItem]}
                    onPress={handleLogout}
                >
                    <Text style={[styles.menuText, styles.dangerText]}>Выйти</Text>
                </TouchableOpacity>
            </View>
            
            <Text style={styles.footer}>BurnCalc © 2026</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 28,
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    profileRole: {
        fontSize: 14,
        color: '#666',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
        color: '#333',
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    menuValue: {
        fontSize: 16,
        color: '#666',
    },
    menuArrow: {
        fontSize: 20,
        color: '#999',
    },
    dangerItem: {
        borderBottomColor: '#ffebee',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#ff0202ff',
        borderRadius: 8,
    },
    dangerText: {
        color: '#ffffff',
    },
    footer: {
        textAlign: 'center',
        fontSize: 14,
        color: '#999',
        marginTop: 20,
        marginBottom: 30,
    },
});