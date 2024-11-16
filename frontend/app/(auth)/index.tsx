import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, useRouter } from 'expo-router';

const index = () => {
    const router = useRouter();
    return <Redirect href={"/login"} />

}

export default index

const styles = StyleSheet.create({
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
})