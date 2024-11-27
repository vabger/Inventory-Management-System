import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const WorkerHomeScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Worker Home</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/help')}
            >
                <Text style={styles.buttonText}>Open Barcode Scanner</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/AssignedWorkScreen')}
            >
                <Text style={styles.buttonText}>View Assigned Work</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WorkerHomeScreen;
