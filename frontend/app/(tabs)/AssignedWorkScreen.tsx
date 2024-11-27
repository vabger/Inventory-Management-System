import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import workerShipmentStore from '@/store/WorkerShipmentStore';

const AssignedWorkScreen = observer(() => {
    useEffect(() => {
        workerShipmentStore.fetchAssignedShipments();
    }, []);

    const handleMarkInProgress = async (shipmentId) => {
        try {
            await workerShipmentStore.markShipmentInProgress(shipmentId);
            Alert.alert('Success', 'Shipment marked as In Progress.');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to mark shipment as In Progress.');
        }
    };

    const handleCompleteShipment = async (shipmentId) => {
        try {
            await workerShipmentStore.completeShipment(shipmentId);
            Alert.alert('Success', 'Shipment marked as Completed.');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to mark shipment as Completed.');
        }
    };

    const renderShipment = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Type: {item.type}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Created At: {item.created_at}</Text>
            <Text>Items:</Text>
            {item.items.map((itemDetail, index) => (
                <Text key={index} style={styles.itemDetail}>
                    - Item: {itemDetail.item}, Quantity: {itemDetail.quantity}, Location:
                    {` Aisle: ${itemDetail.location.aisle}, Row: ${itemDetail.location.row}, Level: ${itemDetail.location.level}, Bin: ${itemDetail.location.bin}`}
                </Text>
            ))}

            {item.status === 'Assigned' && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleMarkInProgress(item.id)}
                >
                    <Text style={styles.buttonText}>Mark In Progress</Text>
                </TouchableOpacity>
            )}

            {item.status === 'In Progress' && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCompleteShipment(item.id)}
                >
                    <Text style={styles.buttonText}>Mark as Done</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={workerShipmentStore.shipments}
                keyExtractor={(item) => item.id}
                renderItem={renderShipment}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemDetail: {
        fontSize: 14,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AssignedWorkScreen;
