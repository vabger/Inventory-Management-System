import { types, flow } from 'mobx-state-tree';
import { BASE_URL } from '@/constants/url';
import authStore from './Authstore';

const Item = types.model({
    item: types.string,
    quantity: types.number,
    location: types.model({
        aisle: types.string,
        row: types.string,
        level: types.string,
        bin: types.string,
    }),
});

const Shipment = types.model({
    id: types.string,
    type: types.string,
    status: types.string,
    created_by: types.string,
    assigned_to: types.maybeNull(types.string),
    created_at: types.string,
    updated_at: types.string,
    items: types.array(Item),
});

const ShipmentStore = types
    .model('ShipmentStore', {
        shipments: types.array(Shipment),
        loading: types.optional(types.boolean, false),
    })
    .actions((self) => ({
        fetchShipments: flow(function* () {
            try {
                const accessToken = authStore.accessToken;
                self.loading = true;

                const response = yield fetch(`${BASE_URL}/shipment/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.status === 200) {
                    const data = yield response.json();
                    self.shipments = data.shipments;
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to fetch shipments.');
                }
            } catch (error) {
                console.error('Failed to fetch shipments:', error);
            } finally {
                self.loading = false;
            }
        }),

        assignWorker: flow(function* (shipmentId, workerId) {
            try {
                const accessToken = authStore.accessToken;
                console.log(workerId)

                const response = yield fetch(`${BASE_URL}/shipment/assign-worker`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ "shipment_id": shipmentId, "worker_id": workerId }),
                });

                if (response.status !== 200) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to assign worker.');
                } else {
                    yield self.fetchShipments(); // Refresh shipments
                }
            } catch (error) {
                console.error('Failed to assign worker:', error);
            }
        }),

        createShipment: flow(function* (shipmentData) {
            try {
                const accessToken = authStore.accessToken;

                const response = yield fetch(`${BASE_URL}/shipment/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(shipmentData),
                });
                console.log(response)

                if (response.status === 200) {
                    const data = yield response.json();
                    self.shipments.push(data.shipment);
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to create shipment.');
                }
            } catch (error) {
                console.error('Failed to create shipment:', error);
                throw error;
            }
        }),
    }));

const shipmentStore = ShipmentStore.create();
export default shipmentStore;
