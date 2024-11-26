from rest_framework import serializers
from .models import Item, Location


class LocationSerializer(serializers.Serializer):
    aisle = serializers.CharField(max_length=10)
    row = serializers.CharField(max_length=10)
    level = serializers.CharField(max_length=10)
    bin = serializers.CharField(max_length=10)

class ItemLocationSerializer(serializers.Serializer):
    item_id = serializers.UUIDField()
    location = LocationSerializer()
    quantity = serializers.IntegerField(min_value=0)

class ItemSerializer(serializers.ModelSerializer):
    item_locations = ItemLocationSerializer(many=True,read_only=True)
    class Meta:
        model = Item
        read_only_fields=['quantity']
        fields = '__all__'



