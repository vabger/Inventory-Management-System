// stores/AuthStore.js
import { types, flow } from "mobx-state-tree";
import { persist } from 'mst-persist';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import { BASE_URL } from "@/constants/url";
import { router } from "expo-router";

const AuthStore = types
    .model("AuthStore", {
        accessTokenExpiresAt: types.maybeNull(types.Date),
        isLoggedIn: types.optional(types.boolean, false),
        is_staff: types.optional(types.boolean, false),
        username: types.optional(types.string, "unknown"),
        email: types.optional(types.string, "unknown"),
        accessToken: types.optional(types.string, ""),
        refreshToken: types.optional(types.string, ""),
    })
    .actions((self) => ({
        login: flow(function* (username, password) {
            try {
                const formattedData = {
                    username: username,
                    password: password,
                };

                const response = yield fetch(`${BASE_URL}/user/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formattedData),
                });

                const data = yield response.json();
                console.log(data);

                if (response?.status === 200) {
                    self.isLoggedIn = true;
                    self.username = data.username;
                    self.email = data.email;
                    self.accessToken = data.access_token;
                    self.refreshToken = data.refresh_token;
                    self.is_staff = data.is_staff;
                    self.accessTokenExpiresAt = new Date(Date.now() + 5 * 1000);
                    console.log("Access token expires at:", self.accessTokenExpiresAt);

                    ToastAndroid.show("Login successful", ToastAndroid.SHORT);
                    router.replace("/(tabs)/home");
                } else {
                    ToastAndroid.show("Invalid credentials", ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error("Login failed:", error);
                ToastAndroid.show("Login failed. Please try again.", ToastAndroid.SHORT);
            }
        }),

        logout() {
            self.accessTokenExpiresAt = null;
            self.isLoggedIn = false;
            self.username = "unknown";
            self.email = "unknown";
            self.accessToken = "";
            self.refreshToken = "";
            self.is_staff = false;
            ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);

            router.replace("/(auth)/login");
        },

        refreshAccessToken: flow(function* () {
            try {
                const response = yield fetch(`${BASE_URL}/user/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: self.refreshToken }),
                });

                const data = yield response.json();

                if (response.status === 200) {
                    self.accessToken = data.access;
                    self.refreshToken = data.refresh;
                    self.accessTokenExpiresAt = new Date(Date.now() + 5 * 1000);
                    console.log("Access token refreshed, expires at:", self.accessTokenExpiresAt);
                    return true;
                } else {
                    self.logout();
                    return false;
                }
            } catch (error) {
                console.error("Failed to refresh access token:", error);
                self.logout();
                return false;
            }
        }),
    }));

const authStore = AuthStore.create();

persist('authstore', authStore, {
    storage: AsyncStorage,
    jsonify: true,
    whitelist: ["isLoggedIn", "username", "email", "accessToken", "refreshToken", "accessTokenExpiresAt"],
}).then(() => console.log('authstore has been hydrated'));

export default authStore;
