import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    ScrollView,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import shipmentStore from '@/store/ShipmentStore';
import userStore from '@/store/UserStore';
import { useRouter } from 'expo-router';
import itemStore from '@/store/ItemStore';

const ShipmentScreen = observer(() => {
    const router = useRouter();
    const [selectedShipment, setSelectedShipment] = useState(null); // For modal
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility

    useEffect(() => {
        shipmentStore.fetchShipments();
        userStore.fetchUsers(); // Preload users
        itemStore.fetchItems();
    }, []);

    const handleAssignWorker = (shipmentId) => {
        setSelectedShipment(shipmentId);
        setModalVisible(true);

    };

    const handleWorkerSelection = async (workerId) => {
        try {
            await shipmentStore.assignWorker(selectedShipment, workerId);
            Alert.alert('Success', 'Worker assigned successfully!');
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to assign worker.');
        }
    };

    const renderShipment = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Type: {item.type}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Created At: {item.created_at}</Text>

            {item.assigned_to ? (
                <Text>Assigned To: {item.assigned_to}</Text>
            ) : (
                <TouchableOpacity
                    style={styles.assignButton}
                    onPress={() => handleAssignWorker(item.id)}
                >
                    <Text style={styles.buttonText}>Assign Worker</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderWorker = (worker) => {
        return (
            <TouchableOpacity
                key={worker.id}
                style={styles.workerItem}
                onPress={() => handleWorkerSelection(worker.id)}
            >
                <Text>{worker.username}</Text>
            </TouchableOpacity>
        );
    }

    return (

        <View style={styles.container}>
            <FlatList
                data={shipmentStore.shipments}
                keyExtractor={(item) => item.id}
                renderItem={renderShipment}
            />

            {/* Floating button for creating shipments */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => router.push('/CreateShipment')}
            >
                <Text style={styles.floatingButtonText}>+</Text>
            </TouchableOpacity>

            {/* Modal for worker selection */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        <Text style={styles.modalTitle}>Select a Worker</Text>
                        <ScrollView>
                            {userStore.users
                                .filter((user) => user.is_staff !== true).map(renderWorker)}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeModalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },
    assignButton: {
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
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#3498db',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    floatingButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    workerItem: {
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        marginBottom: 10,
    },
    workerText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    closeModalButton: {
        marginTop: 20,
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: '#fff',
    },
});

export default ShipmentScreen;
