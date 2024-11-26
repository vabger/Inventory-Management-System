import { StyleSheet, View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Redirect, useRouter } from "expo-router";
import authStore from "@/store/Authstore";// Import your AuthStore

const Index = observer(() => {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false); // Ensure app is mounted

    useEffect(() => {
        // Simulate app mount readiness
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 2000); // Adjust delay if necessary

        return () => clearTimeout(timer); // Cleanup timer
    }, []);

    useEffect(() => {
        if (isReady) {
            if (authStore.isLoggedIn) {
                router.replace("/home"); // Redirect to Home if logged in
            } else {
                router.replace("/login"); // Redirect to Login if not logged in
            }
        }
    }, [isReady, authStore.isLoggedIn]);

    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
    );
});

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
