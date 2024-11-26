import { types, flow } from 'mobx-state-tree';
import { BASE_URL } from '@/constants/url';
import authStore from './Authstore';

const Item = types.model('Item', {
    id: types.identifier, // Server-generated ID
    name: types.string,
    description: types.maybeNull(types.string),
    total_quantity: types.number, // Updated field name
    price: types.string,
    sku: types.string,
    category: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    minimum_stock_level: types.number,
    item_locations: types.array(types.frozen()), // Flexible structure for item locations
});

const ItemStore = types
    .model('ItemStore', {
        items: types.array(Item), // Array of items
        loading: types.optional(types.boolean, false), // Loading state
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

                if (response.status === 200) {
                    const data = yield response.json();
                    console.log('Fetched items:', data);
                    self.loading = true
                    // Transform data if needed
                    self.items = data.map((item) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description || null,
                        total_quantity: item.total_quantity,
                        price: item.price,
                        sku: item.sku,
                        category: item.category || null,
                        image: item.image || null,
                        minimum_stock_level: item.minimum_stock_level,
                        item_locations: item.item_locations || [],
                    }));

                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to fetch items.');
                }
            } catch (error) {
                console.error('Failed to fetch items:', error);
            } finally {
                self.loading = false;
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

                if (response.status === 201) {
                    const data = yield response.json();
                    console.log('Item added successfully:', data);

                    const newItem = {
                        id: data.id,
                        name: data.name,
                        description: data.description || null,
                        total_quantity: data.total_quantity,
                        price: data.price,
                        sku: data.sku,
                        category: data.category || null,
                        image: data.image || null,
                        minimum_stock_level: data.minimum_stock_level,
                        item_locations: data.item_locations || [],
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

                if (response.status === 200) {
                    console.log('Item deleted successfully');
                    yield self.fetchItems(); // Refresh the item list
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to delete item.');
                }
            } catch (error) {
                console.error('Failed to delete item:', error);
            }
        }),
    }));

const itemStore = ItemStore.create();
export default itemStore;
