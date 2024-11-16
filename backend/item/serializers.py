from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class UpdateQuantitySerializer(serializers.ModelSerializer):
    class Meta: 
        model= Item
        fields = ['id', 'name', 'quantity', 'sku', 'minimum_stock_level']
        read_only_fields = ['id', 'name', 'sku','minimum_stock_level']
