import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
import workerStore from '@/store/WorkerStore';

const WorkerScreen = observer(() => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [item, setItem] = useState(null);

  // Request permission for the camera
  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  // Handle scanning
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setBarcode(data);

    try {
      const itemDetails = await workerStore.fetchItemDetails(data);
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
      await workerStore.updateItemQuantity(item.id, parseInt(quantity));
      Alert.alert('Success', 'Quantity updated successfully!');
      setItem(null); // Reset item details
      setQuantity(''); // Reset quantity
      setScanned(false); // Allow new scan
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update quantity.');
    }
  };

  // UI for barcode scanner or item details
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Worker Options</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestCameraPermission}
        >
          <Text style={styles.buttonText}>Scan Barcode</Text>
        </TouchableOpacity>

        {hasPermission === null && (
          <Text style={styles.infoText}>Requesting camera permission...</Text>
        )}

        {hasPermission === false && (
          <Text style={styles.infoText}>Camera access denied.</Text>
        )}

        {hasPermission && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
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
