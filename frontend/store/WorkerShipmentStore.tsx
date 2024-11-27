import { types, flow } from 'mobx-state-tree';
import { BASE_URL } from '@/constants/url';
import authStore from './Authstore';
import { YellowBox } from 'react-native';

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
    id: types.identifier,
    type: types.string,
    status: types.string,
    created_by: types.string,
    assigned_to: types.string,
    created_at: types.string,
    updated_at: types.string,
    items: types.array(Item),
});

const WorkerShipmentStore = types
    .model('WorkerShipmentStore', {
        shipments: types.array(Shipment),
        loading: types.optional(types.boolean, false),
    })
    .actions((self) => ({
        fetchAssignedShipments: flow(function* () {
            try {
                const accessToken = authStore.accessToken;
                self.loading = true;

                const response = yield fetch(`${BASE_URL}/shipment/view`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                console.log(response.status)
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

        markShipmentInProgress: flow(function* (shipmentId) {
            try {
                const accessToken = authStore.accessToken;

                const response = yield fetch(`${BASE_URL}/shipment/in-progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ shipment_id: shipmentId }),
                });

                if (response.status === 200) {
                    const data = yield response.json();
                    self.shipments = self.shipments.map((shipment) =>
                        shipment.id === shipmentId ? data.shipment : shipment
                    );
                    yield self.fetchAssignedShipments()
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to update shipment.');
                }
            } catch (error) {
                console.error('Failed to mark shipment as in progress:', error);
                throw error;
            }
        }),

        completeShipment: flow(function* (shipmentId) {
            try {
                const accessToken = authStore.accessToken;

                const response = yield fetch(`${BASE_URL}/shipment/complete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ shipment_id: shipmentId }),
                });

                if (response.status === 200) {
                    const data = yield response.json();
                    self.shipments = self.shipments.map((shipment) =>
                        shipment.id === shipmentId ? data.shipment : shipment
                    );
                } else {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to complete shipment.');
                }
            } catch (error) {
                console.error('Failed to complete shipment:', error);
                throw error;
            }
        }),
    }));

const workerShipmentStore = WorkerShipmentStore.create();
export default workerShipmentStore;
