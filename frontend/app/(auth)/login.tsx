// screens/LoginScreen.js
import React from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import { useLocalSearchParams, useRouter } from "expo-router";
import Authstore from "@/store/Authstore";

// Validation Schema
const validationSchema = Yup.object().shape({
    username: Yup.string()
        .matches(/^[^0-9]/, "Username should not start with a number") // Prevent username from starting with a number
        .required("Username is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const LoginScreen = observer(() => {

    const handleLogin = (values) => {

        Authstore.login(values.username, values.password); // Passing userType
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            onChangeText={handleChange("username")}
                            onBlur={handleBlur("username")}
                            value={values.username}
                        />
                        {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            value={values.password}
                            secureTextEntry
                        />
                        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <Button title="Login" onPress={handleSubmit} />
                    </>
                )}
            </Formik>
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
    errorText: { color: "red", fontSize: 12 },
});

export default LoginScreen;
