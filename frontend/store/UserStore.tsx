// stores/UserStore.js
import { types, flow } from 'mobx-state-tree';
import User from './models/User';
// Ensure correct import path
import { BASE_URL } from "@/constants/url";
import authStore from './Authstore';

const UserStore = types
    .model('UserStore', {
        users: types.array(User),
        loading: types.optional(types.boolean, false),
    })
    .actions((self) => ({
        // Fetch Users
        fetchUsers: flow(function* () {
            try {
                // Check if access token has expired
                if (
                    authStore.accessTokenExpiresAt &&
                    authStore.accessTokenExpiresAt < new Date()
                ) {
                    const refreshed = yield authStore.refreshAccessToken();
                    if (!refreshed) {
                        console.error('Failed to refresh access token');
                        return;
                    }
                } else {
                    console.log(`Access token not expired: ${authStore.accessTokenExpiresAt}`);
                }

                const accessToken = authStore.accessToken;
                self.loading = true;

                const response = yield fetch(`${BASE_URL}/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                console.log("User list endpoint status: " + response.status);

                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to fetch users.');
                }

                const data = yield response.json();
                self.users = data.users;
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                self.loading = false; // Ensure loading is reset even if an error occurs
            }
        }),

        // Delete User
        deleteUser: flow(function* (userId) {
            try {
                // Check if access token has expired
                if (
                    authStore.accessTokenExpiresAt &&
                    authStore.accessTokenExpiresAt < new Date()
                ) {
                    const refreshed = yield authStore.refreshAccessToken();
                    if (!refreshed) {
                        console.error('Failed to refresh access token');
                        return;
                    }
                }

                const accessToken = authStore.accessToken;

                const response = yield fetch(`${BASE_URL}/user/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ user_id: userId }),
                });
                console.log("Delete user endpoint status: " + response.status);

                if (response.status === 200) {
                    yield self.fetchUsers();
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to delete user.');
                }
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }),

        // Add User
        addUser: flow(function* (newUser) {
            try {
                // Check if access token has expired
                if (
                    authStore.accessTokenExpiresAt &&
                    authStore.accessTokenExpiresAt < new Date()
                ) {
                    const refreshed = yield authStore.refreshAccessToken();
                    if (!refreshed) {
                        console.error('Failed to refresh access token');
                        return;
                    }
                }

                const accessToken = authStore.accessToken;

                const response = yield fetch(`${BASE_URL}/user/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(newUser),
                });
                console.log("Add user endpoint status: " + response.status);

                if (response.status === 201) {
                    yield self.fetchUsers();
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to add new user.');
                }
            } catch (error) {
                console.error('Failed to add new user:', error);
            }
        }),
    }));

const userStore = UserStore.create();

export default userStore;
