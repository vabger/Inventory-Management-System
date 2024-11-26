from rest_framework import serializers
from .models import Item, Location


class LocationSerializer(serializers.Serializer):
    aisle = serializers.CharField(max_length=10, help_text="Aisle identifier, e.g., A1")
    row = serializers.CharField(max_length=10, help_text="Row identifier, e.g., R1")
    level = serializers.CharField(max_length=10, help_text="Level identifier, e.g., L2")
    bin = serializers.CharField(max_length=10, help_text="Bin identifier, e.g., B3")

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



