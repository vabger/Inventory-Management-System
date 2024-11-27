import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    Alert,
    Modal,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import shipmentStore from '@/store/ShipmentStore';
import itemStore from '@/store/ItemStore'; // Assuming this is where all items are stored
import { useRouter } from 'expo-router';

const CreateShipmentScreen = observer(() => {
    const router = useRouter();

    const [shipmentType, setShipmentType] = useState('Inbound'); // Default shipment type
    const [selectedItems, setSelectedItems] = useState([]); // Selected items with quantities
    const [modalVisible, setModalVisible] = useState(false); // Modal for selecting items
    const [selectedItem, setSelectedItem] = useState(null); // Current selected item for quantity input
    const [quantity, setQuantity] = useState(''); // Quantity for the selected item

    // Add an item to the shipment
    const handleAddItem = () => {
        if (!selectedItem || !quantity || isNaN(quantity)) {
            Alert.alert('Validation Error', 'Please select an item and enter a valid quantity.');
            return;
        }

        const existingItem = selectedItems.find((item) => item.item === selectedItem.id);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
            setSelectedItems([...selectedItems]);
        } else {
            setSelectedItems([
                ...selectedItems,
                { item: selectedItem.id, quantity: parseInt(quantity), name: selectedItem.name },
            ]);
        }

        setSelectedItem(null);
        setQuantity('');
        setModalVisible(false);
    };

    // Remove an item from the shipment
    const handleRemoveItem = (itemId) => {
        setSelectedItems(selectedItems.filter((item) => item.item !== itemId));
    };

    // Create the shipment
    const handleCreateShipment = async () => {
        if (selectedItems.length === 0) {
            Alert.alert('Validation Error', 'Please add at least one item to the shipment.');
            return;
        }

        const shipmentData = {
            type: shipmentType,
            items: selectedItems.map(({ item, quantity }) => ({ item, quantity })),
        };

        try {
            await shipmentStore.createShipment(shipmentData);
            Alert.alert('Success', 'Shipment created successfully!');
            router.push('/shipments'); // Navigate back to shipment list
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create shipment.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Shipment</Text>

            {/* Shipment Type Selector */}
            <View style={styles.typeSelector}>
                <TouchableOpacity
                    style={[
                        styles.typeButton,
                        shipmentType === 'Inbound' && styles.typeButtonActive,
                    ]}
                    onPress={() => setShipmentType('Inbound')}
                >
                    <Text
                        style={[
                            styles.typeButtonText,
                            shipmentType === 'Inbound' && styles.typeButtonTextActive,
                        ]}
                    >
                        Inbound
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.typeButton,
                        shipmentType === 'Outbound' && styles.typeButtonActive,
                    ]}
                    onPress={() => setShipmentType('Outbound')}
                >
                    <Text
                        style={[
                            styles.typeButtonText,
                            shipmentType === 'Outbound' && styles.typeButtonTextActive,
                        ]}
                    >
                        Outbound
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Selected Items List */}
            <FlatList
                data={selectedItems}
                keyExtractor={(item) => item.item}
                renderItem={({ item }) => (
                    <View style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>
                            {item.name} (Quantity: {item.quantity})
                        </Text>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveItem(item.item)}
                        >
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListHeaderComponent={<Text style={styles.listHeader}>Selected Items</Text>}
                ListEmptyComponent={<Text style={styles.emptyList}>No items selected.</Text>}
            />

            {/* Add Item Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>

            {/* Create Shipment Button */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateShipment}
            >
                <Text style={styles.createButtonText}>Create Shipment</Text>
            </TouchableOpacity>

            {/* Item Selection Modal */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Item</Text>
                    <FlatList
                        data={itemStore.items}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.itemOption}
                                onPress={() => setSelectedItem(item)}
                            >
                                <Text style={styles.itemOptionText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    {selectedItem && (
                        <View style={styles.quantityInputContainer}>
                            <TextInput
                                style={styles.quantityInput}
                                placeholder="Enter Quantity"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="number-pad"
                            />
                            <TouchableOpacity
                                style={styles.addQuantityButton}
                                onPress={handleAddItem}
                            >
                                <Text style={styles.addQuantityButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.closeModalButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeModalButtonText}>Close</Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
    },
    typeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    typeButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    typeButtonActive: {
        backgroundColor: '#3498db',
    },
    typeButtonText: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    typeButtonTextActive: {
        color: '#fff',
    },
    selectedItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
    },
    selectedItemText: {
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: '#e74c3c',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f8f8f8',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    itemOption: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
    },
    itemOptionText: {
        fontSize: 16,
    },
    quantityInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginRight: 10,
    },
    addQuantityButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 8,
    },
    addQuantityButtonText: {
        color: '#fff',
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
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyList: {
        textAlign: 'center',
        color: '#aaa',
        marginTop: 20,
    },
});

export default CreateShipmentScreen;
