from rest_framework import serializers
from .models import Shipment, ShipmentItem
from item.serializers import LocationSerializer

class ShipmentItemSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    class Meta:
        model = ShipmentItem
        fields = ['item', 'quantity','location']

class ShipmentSerializer(serializers.ModelSerializer):
    items = ShipmentItemSerializer(many=True, required=True)

    class Meta:
        model = Shipment
        fields = ['id', 'type', 'status', 'created_by', 'assigned_to', 'created_at', 'updated_at', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        shipment = Shipment.objects.create(**validated_data)
        for item_data in items_data:
            ShipmentItem.objects.create(shipment=shipment, **item_data)
        return shipment

    
        