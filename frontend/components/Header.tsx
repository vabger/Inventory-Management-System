
// components/Header.js
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import authStore from '@/store/Authstore';

const Header = observer(() => {


    return (
        <View style={styles.header}>
            <Text style={styles.userName}>Dashboard</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={authStore.logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

        </View>
    );
});

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        height: 100,
        paddingHorizontal: 15,
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userName: {
        fontSize: 18,
    },
    logoutButton: {
        backgroundColor: '#e74c3c', // Red background for logout
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
    },
    logoutText: {
        color: '#fff', // White text for contrast
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Header;
