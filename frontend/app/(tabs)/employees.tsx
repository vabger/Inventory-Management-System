import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert, Modal, TextInput, Button } from 'react-native';
import UserCard from '@/components/UserCard';
import { AntDesign } from '@expo/vector-icons';
import userStore from '@/store/UserStore';
import { Observer } from 'mobx-react-lite';
import { loadAsync } from 'expo-font';
import Header from '@/components/Header';



const UserList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => { userStore.fetchUsers() }, [])

    const handleDelete = (userId) => {
        // Confirm deletion
        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => userStore.deleteUser(userId),
                },
            ],
            { cancelable: true }
        );
    };

    const handleAddUser = () => {
        setModalVisible(true);
    };

    const handleConfirmAddUser = () => {
        // Validate inputs
        if (!newUsername.trim() || !newEmail.trim()) {
            Alert.alert('Validation Error', 'Please enter both username and email.');
            return;
        }

        // Optionally validate email format
        const validateEmail = (email) => {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        };

        if (!validateEmail(newEmail)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Validation Error', 'Please enter a minimum 8 digit password.');
            return;
        }

        const newUser = {
            username: newUsername,
            email: newEmail,
            password: newPassword,
        };

        userStore.addUser(newUser);

        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setModalVisible(false);
    };

    const handleCancelAddUser = () => {
        // Reset state and close modal
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setModalVisible(false);
    };


    return (
        <>
            <Header />
            <Observer>{() =>
                <View style={styles.container}>
                    <FlatList
                        data={userStore.users}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <UserCard user={item} onDelete={handleDelete} />
                        )}
                    />

                    {/* Add User Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={handleCancelAddUser}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Add New User</Text>

                                <TextInput
                                    placeholder="Username"
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Email"
                                    value={newEmail}
                                    onChangeText={setNewEmail}
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <TextInput
                                    placeholder="password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    style={styles.input}
                                    keyboardType="visible-password"
                                    autoCapitalize="none"
                                />

                                <View style={styles.modalButtons}>
                                    <Button title="Cancel" onPress={handleCancelAddUser} />
                                    <Button title="Add" onPress={handleConfirmAddUser} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={styles.fab} onPress={handleAddUser}>
                        <AntDesign name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text>{userStore.loading}</Text>

                </View>}
            </Observer>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#2ecc71',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        elevation: 10, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.25, // For iOS shadow
        shadowRadius: 3.84, // For iOS shadow
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default UserList;
