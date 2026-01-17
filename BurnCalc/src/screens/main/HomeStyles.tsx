import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1E88E5',
    },
    subtitle: {
        fontSize: 16,
        marginVertical: 12,
        color: '#555',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#43A047',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
    },
});
