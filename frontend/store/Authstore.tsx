// stores/AuthStore.js
import { types, flow } from "mobx-state-tree";
import { Alert, ToastAndroid } from "react-native";

const AuthStore = types
    .model("AuthStore", {
        isLoggedIn: types.optional(types.boolean, false),
    })
    .actions((self) => ({
        login: flow(function* (username, password) {
            Alert.alert("Username: " + username + " Password: " + password); // For debugging purposes
            try {
                const formattedData = {
                    username: username,
                    password: password
                };
                // Replace with actual API call
                const response = yield fetch("http://192.168.153.177:8000/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formattedData), // Use username instead of email
                });

                const data = yield response.json();

                if (data.success) {
                    self.isLoggedIn = true;
                    ToastAndroid.show("Login successful", ToastAndroid.SHORT); // Show success message
                    // Handle additional login success logic here
                } else {
                    ToastAndroid.show("Invalid credentials", ToastAndroid.SHORT); // Show error message
                }
            } catch (error) {
                console.error("Login failed:", error);
                ToastAndroid.show("Login failed. Please try again.", ToastAndroid.SHORT); // Show error message
            }
        }),
    }));

export default AuthStore.create();
