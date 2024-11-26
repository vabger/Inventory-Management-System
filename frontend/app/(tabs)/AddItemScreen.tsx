import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import itemStore from '@/store/ItemStore';

const categories = ['Electronics', 'Furniture', 'Clothing', 'Groceries', 'Books', 'Toys', 'Others']; // Predefined categories

const AddItemScreen = observer(() => {


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [total_quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [minimumStockLevel, setMinimumStockLevel] = useState('');
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

    const handleSubmit = async () => {
        if (!name || !total_quantity || !price || !sku || !minimumStockLevel) {
            Alert.alert('Validation Error', 'Please fill all required fields!');
            return;
        }

        if (parseInt(total_quantity) < 0 || isNaN(minimumStockLevel)) {
            Alert.alert('Validation Error', 'Quantity and Minimum Stock Level must be valid numbers!');
            return;
        }

        if (isNaN(parseFloat(price))) {
            Alert.alert('Validation Error', 'Price must be a valid number!');
            return;
        }

        const newItem = {
            name,
            description: description || null,
            total_quantity: parseInt(total_quantity),
            price: parseFloat(price).toFixed(2),
            sku,
            categories,
            minimum_stock_level: parseInt(minimumStockLevel),
        };

        try {
            await itemStore.addItem(newItem);
            Alert.alert('Success', 'Item added successfully!');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to add item. Please try again.');
        }
    };

    const openCategoryDrawer = () => setCategoryModalVisible(true);
    const closeCategoryDrawer = () => setCategoryModalVisible(false);

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        closeCategoryDrawer();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Item</Text>

            <TextInput style={styles.input} placeholder="Name *" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Quantity *" value={total_quantity} onChangeText={setQuantity} keyboardType="number-pad" />
            <TextInput style={styles.input} placeholder="Price *" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
            <TextInput style={styles.input} placeholder="SKU *" value={sku} onChangeText={setSku} />

            {/* Category Field */}
            <TouchableOpacity style={styles.input} onPress={openCategoryDrawer}>
                <Text style={category ? styles.selectedCategory : styles.placeholder}>
                    {category || 'Select a Category *'}
                </Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Minimum Stock Level *" value={minimumStockLevel} onChangeText={setMinimumStockLevel} keyboardType="number-pad" />

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>

            {/* Category Drawer Modal */}
            <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select a Category</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.categoryOption} onPress={() => handleCategorySelect(item)}>
                                    <Text style={styles.categoryText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={closeCategoryDrawer}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop: 30,
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
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
    placeholder: {
        color: '#aaa',
    },
    selectedCategory: {
        color: '#000',
    },
    addButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2c3e50',
    },
    categoryOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    categoryText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    closeButton: {
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddItemScreen;
