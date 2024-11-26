// screens/ItemListScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '@/components/Header';
import itemStore from '@/store/ItemStore';
import { useRouter } from 'expo-router';

const ItemListScreen = observer(() => {
    useEffect(() => {
        itemStore.fetchItems();
    }, []);
    const router = useRouter();

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => itemStore.deleteItem(id) },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Price: ${item.price}</Text>
            <Text style={styles.itemDetails}>Category: {item.category}</Text>
            <Text style={styles.itemDetails}>Quantity: {item.total_quantity}</Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
    console.log("first item : " + itemStore.items[0])
    return (
        <>
            <Header />
            <View style={styles.container}>
                <FlatList
                    data={itemStore.items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => {
                        router.push("/(tabs)/AddItemScreen")
                    }}
                >
                    <MaterialIcons name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </>

    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    list: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        position: 'relative',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    itemDetails: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 5,
    },
    deleteButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 6,
        elevation: 3,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default ItemListScreen;
