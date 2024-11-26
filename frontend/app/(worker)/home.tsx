import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import { observer } from 'mobx-react-lite';
import itemStore from '@/store/ItemStore';

const WorkerScreen = observer(() => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [quantity, setQuantity] = useState('');
    const [item, setItem] = useState(null);

    // Request camera permission
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Handle barcode scanning
    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true);
        setBarcode(data);

        try {
            const itemDetails = await itemStore.fetchItemDetails(data);
            setItem(itemDetails);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to fetch item details.');
        }
    };

    // Submit updated quantity
    const handleSubmit = async () => {
        if (!quantity || isNaN(quantity)) {
            Alert.alert('Validation Error', 'Please enter a valid quantity!');
            return;
        }

        try {
            await itemStore.updateQuantity(item.id, parseInt(quantity));
            Alert.alert('Success', 'Quantity updated successfully!');
            setItem(null); // Reset item details
            setQuantity(''); // Reset quantity
            setScanned(false); // Allow new scan
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to update quantity.');
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.infoText}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.infoText}>No access to camera</Text>
                <TouchableOpacity style={styles.button} onPress={() => Camera.requestCameraPermissionsAsync()}>
                    <Text style={styles.buttonText}>Request Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Render camera or item details
    if (!item) {
        return (
            <View style={styles.container}>
                <Camera
                    style={styles.camera}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barCodeScannerSettings={{
                        barCodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code128'],
                    }}
                >
                    <View style={styles.cameraOverlay}>
                        <Text style={styles.infoText}>Scan a barcode</Text>
                    </View>
                </Camera>
                {scanned && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setScanned(false)} // Reset scanning
                    >
                        <Text style={styles.buttonText}>Scan Again</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Item Details</Text>
            <View style={styles.itemDetails}>
                <Text style={styles.label}>Name: {item.name}</Text>
                <Text style={styles.label}>SKU: {item.sku}</Text>
                <Text style={styles.label}>Category: {item.category}</Text>
                <Text style={styles.label}>Price: ${item.price}</Text>
                <Text style={styles.label}>Current Quantity: {item.quantity}</Text>
            </View>

            {/* Input field below item details */}
            <TextInput
                style={styles.input}
                placeholder="Enter New Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Update Quantity</Text>
            </TouchableOpacity>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'flex-start',
        backgroundColor: '#f8f8f8',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    cameraOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 10,
    },
    itemDetails: {
        marginVertical: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
        color: '#2c3e50',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
        fontSize: 16,
    },
});

export default WorkerScreen;
