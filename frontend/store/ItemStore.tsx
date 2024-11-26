// store/ItemStore.js
import { types, flow } from 'mobx-state-tree';
import { BASE_URL } from '@/constants/url';
import authStore from './Authstore';

const Item = types.model('Item', {
    id: types.maybeNull(types.identifier),
    name: types.string,
    description: types.maybeNull(types.string),
    quantity: types.number,
    price: types.string,
    sku: types.string,
    category: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    minimum_stock_level: types.number,
});

const ItemStore = types
    .model('ItemStore', {
        items: types.array(Item),
        loading: types.optional(types.boolean, false),
    })
    .actions((self) => ({
        fetchItems: flow(function* () {
            try {

                const accessToken = authStore.accessToken;
                self.loading = true;

                const response = yield fetch(`${BASE_URL}/item/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const data = yield response.json();
                self.items = data;
                console.log("fetch item response " + response.status)

            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        }),

        addItem: flow(function* (itemData) {
            try {
                const accessToken = authStore.accessToken;

                const response = yield fetch(`${BASE_URL}/item/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(itemData),
                });
                console.log('add item response status:', response.status);
                if (response.status === 201) {
                    const data = yield response.json();
                    console.log('Item added successfully:', data);

                    // Add the item returned by the server
                    const newItem = {
                        id: data.id, // Use server-generated ID
                        name: data.name,
                        description: data.description,
                        quantity: data.quantity,
                        price: data.price,
                        sku: data.sku,
                        category: data.category || null,
                        image: data.image || null,
                        minimum_stock_level: data.minimum_stock_level,
                    };

                    self.items.push(newItem);
                } else {
                    const errorData = yield response.json();
                    console.error('Error adding item:', errorData);
                    throw new Error(errorData.message || 'Failed to add item.');
                }
            } catch (error) {
                console.error('Failed to add item:', error);
                throw error;
            }
        }),


        deleteItem: flow(function* (id) {
            try {
                const accessToken = authStore.accessToken;

                const response = yield fetch(`${BASE_URL}/item/delete?item_id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },

                });

                console.log("delete item response " + response.status)

                if (response.status === 200) {
                    yield self.fetchItems();
                    console.log(self.items[0])
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to delete user.');
                }
            } catch (error) {
                console.error('Failed to delete item:', error);
            }
        }),
    }));

const itemStore = ItemStore.create()
export default itemStore;
