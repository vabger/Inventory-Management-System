// components/UserCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { observer } from 'mobx-react-lite';

const UserCard = observer(({ user, onEdit, onDelete }: any) => (
    <View style={styles.card}>
        <Text style={styles.username}>{user.username}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Role: {user.is_staff ? 'Admin' : 'Worker'}</Text>

        {!user.is_staff && (
            <View style={styles.buttons}>
                <Button title="Delete" onPress={() => onDelete(user.id)} color="red" />
            </View>
        )}

    </View>
));

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
});

export default UserCard;
