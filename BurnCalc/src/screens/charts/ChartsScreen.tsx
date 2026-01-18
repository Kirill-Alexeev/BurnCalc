import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { AuthContext } from '../../context/AuthContext';
import { getCalculationsByUserId, getCalculationsByDoctorId } from '../../db/repositories/calculationRepository';
import { getDoctorPatients } from '../../services/firebase/patients';
import { CalculationEntity } from '../../models/Calculation';
import PatientSearch from '../../components/PatientSearch';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ChartsScreen() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [calculations, setCalculations] = useState<CalculationEntity[]>([]);

    useEffect(() => {
        loadData();
    }, [user]);

    useEffect(() => {
        if (selectedPatientId || user?.role === 'patient') {
            loadCalculations();
        }
    }, [selectedPatientId]);

    const loadData = async () => {
        try {
            if (user?.role === 'doctor') {
                const patientsList = await getDoctorPatients(user.uid);
                setPatients(patientsList);

                if (patientsList.length > 0 && !selectedPatientId) {
                    setSelectedPatientId(patientsList[0].id);
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };

    const loadCalculations = async () => {
        try {
            setLoading(true);
            let data: CalculationEntity[] = [];

            if (user?.role === 'patient') {
                data = await getCalculationsByUserId(user.uid);
            } else if (user?.role === 'doctor' && selectedPatientId) {
                const allCalculations = await getCalculationsByDoctorId(user.uid);
                data = allCalculations.filter(calc => calc.patientId === selectedPatientId);
            }

            setCalculations(data);
        } catch (error) {
            console.error('Ошибка загрузки расчётов:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };

    const generateChartHTML = (data: CalculationEntity[], title: string, dataKey: 'itp' | 'totalTBSA') => {
        if (data.length === 0) {
            return `
                <html>
                <body style="display: flex; justify-content: center; align-items: center; height: 100%; background: #f8f9fa;">
                    <div style="color: #999; font-size: 16px; text-align: center; padding: 20px;">
                        Нет данных для построения графика
                    </div>
                </body>
                </html>
            `;
        }

        // Сортируем по дате
        const sortedData = [...data].sort((a, b) => a.createdAt - b.createdAt);

        // Форматируем даты
        const dates = sortedData.map(calc => {
            const date = new Date(calc.createdAt);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'short'
            });
        });

        const values = sortedData.map(calc => calc[dataKey]);

        // Определяем цвета
        const isITP = dataKey === 'itp';
        const gradientColors = isITP
            ? ['rgba(54, 162, 235, 0.6)', 'rgba(54, 162, 235, 0.1)']
            : ['rgba(255, 99, 132, 0.6)', 'rgba(255, 99, 132, 0.1)'];

        const lineColor = isITP ? 'rgb(54, 162, 235)' : 'rgb(255, 99, 132)';
        const pointColor = isITP ? 'rgb(33, 150, 243)' : 'rgb(244, 67, 54)';

        // Рассчитываем максимальное значение для шкалы Y
        const maxValue = Math.max(...values) * 2; // Добавляем 10% отступа

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body { 
                        margin: 0; 
                        padding: 0; 
                        background: transparent;
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    }
                    .container { 
                        width: 100%; 
                        height: 100%;
                        position: relative;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <canvas id="myChart"></canvas>
                </div>
                <script>
                    const ctx = document.getElementById('myChart').getContext('2d');
                    
                    // Создаём градиент
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, '${gradientColors[0]}');
                    gradient.addColorStop(1, '${gradientColors[1]}');
                    
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ${JSON.stringify(dates)},
                            datasets: [{
                                label: '${isITP ? 'ИТП' : 'ПОТ (%)'}',
                                data: ${JSON.stringify(values)},
                                borderColor: '${lineColor}',
                                backgroundColor: gradient,
                                borderWidth: 4,
                                fill: true,
                                tension: 0.3,
                                pointBackgroundColor: '${pointColor}',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 3,
                                pointRadius: 8,
                                pointHoverRadius: 10
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: '${title}',
                                    font: {
                                        size: 22,
                                        weight: 'bold'
                                    },
                                    color: '#333',
                                    padding: {
                                        top: 0,
                                        bottom: 20
                                    }
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleColor: '#fff',
                                    bodyColor: '#fff',
                                    titleFont: {
                                        size: 16,
                                        weight: 'bold'
                                    },
                                    bodyFont: {
                                        size: 16
                                    },
                                    padding: 12,
                                    cornerRadius: 8,
                                    displayColors: false,
                                    callbacks: {
                                        label: function(context) {
                                            return '${isITP ? 'ИТП: ' : 'ПОТ: '}' + context.parsed.y + '${isITP ? '' : '%'}';
                                        }
                                    }
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: ${maxValue},
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.1)',
                                        lineWidth: 1
                                    },
                                    ticks: {
                                        font: {
                                            size: 14,
                                            weight: 'bold'
                                        },
                                        color: '#666',
                                        padding: 10,
                                        callback: function(value) {
                                            return value + '${isITP ? '' : '%'}';
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: '${isITP ? 'Значение ИТП' : 'Площадь ожога (%)'}',
                                        color: '#333',
                                        font: {
                                            size: 14,
                                            weight: 'bold'
                                        },
                                        padding: {
                                            top: 10,
                                            bottom: 10
                                        }
                                    }
                                },
                                x: {
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.1)',
                                        lineWidth: 1
                                    },
                                    ticks: {
                                        font: {
                                            size: 14,
                                            weight: 'bold'
                                        },
                                        color: '#666',
                                        maxRotation: 0,
                                        padding: 10
                                    },
                                    title: {
                                        display: true,
                                        text: 'Дата обследования',
                                        color: '#333',
                                        font: {
                                            size: 14,
                                            weight: 'bold'
                                        },
                                        padding: {
                                            top: 10,
                                            bottom: 0
                                        }
                                    }
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index'
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInOutQuart'
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `;
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1E88E5" />
                <Text style={styles.loadingText}>Загрузка данных...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.header}>
                <Text style={styles.title}>📊 Графики динамики</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={loadCalculations}
                >
                    <Ionicons name="refresh" size={22} color="#1E88E5" />
                </TouchableOpacity>
            </View>

            {user?.role === 'doctor' && patients.length > 0 && (
                <View style={styles.searchSection}>
                    <PatientSearch
                        patients={patients}
                        selectedPatientId={selectedPatientId}
                        onSelectPatient={setSelectedPatientId}
                    />
                </View>
            )}

            {calculations.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="stats-chart" size={60} color="#ccc" />
                    <Text style={styles.emptyStateTitle}>Нет данных для анализа</Text>
                    <Text style={styles.emptyStateText}>
                        {user?.role === 'doctor'
                            ? selectedPatientId
                                ? 'У выбранного пациента нет расчётов'
                                : 'Выберите пациента для построения графиков'
                            : 'Создайте расчёты в калькуляторе'}
                    </Text>
                </View>
            ) : (
                <>
                    <View style={styles.chartSection}>
                        <Text style={styles.chartTitle}>Динамика индекса тяжести поражения (ИТП)</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            style={styles.chartScrollContainer}
                            contentContainerStyle={styles.chartScrollContent}
                        >
                            <View style={styles.chartContainer}>
                                <WebView
                                    originWhitelist={['*']}
                                    source={{ html: generateChartHTML(calculations, '', 'itp') }}
                                    style={styles.chart}
                                    javaScriptEnabled={true}
                                    scalesPageToFit={false}
                                    startInLoadingState={true}
                                    renderLoading={() => (
                                        <View style={styles.chartLoading}>
                                            <ActivityIndicator size="large" color="#1E88E5" />
                                        </View>
                                    )}
                                />
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.chartSection}>
                        <Text style={styles.chartTitle}>Динамика площади ожога (ПОТ)</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            style={styles.chartScrollContainer}
                            contentContainerStyle={styles.chartScrollContent}
                        >
                            <View style={styles.chartContainer}>
                                <WebView
                                    originWhitelist={['*']}
                                    source={{ html: generateChartHTML(calculations, '', 'totalTBSA') }}
                                    style={styles.chart}
                                    javaScriptEnabled={true}
                                    scalesPageToFit={false}
                                    startInLoadingState={true}
                                    renderLoading={() => (
                                        <View style={styles.chartLoading}>
                                            <ActivityIndicator size="large" color="#F44336" />
                                        </View>
                                    )}
                                />
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={20} color="#1E88E5" />
                        <Text style={styles.infoText}>
                            Всего записей: <Text style={styles.infoHighlight}>{calculations.length}</Text>
                        </Text>
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E88E5',
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
    chartSection: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    chartScrollContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    chartScrollContent: {
        flexGrow: 1,
        minWidth: 300, // Минимальная ширина
    },
    chartContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        borderRadius: 12,
    },
    chart: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    chartLoading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#E3F2FD',
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#1976D2',
        fontWeight: '500',
    },
    infoHighlight: {
        fontWeight: '700',
        color: '#1E88E5',
    },
});