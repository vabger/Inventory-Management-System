from rest_framework import generics
from rest_framework.views import APIView
from .models import Item
from .serializers import ItemSerializer,UpdateQuantitySerializer
from rest_framework.serializers import ValidationError
from rest_framework.exceptions import NotFound
from backend.utils import success_response
from rest_framework.permissions import IsAdminUser

from io import BytesIO
from barcode import Code128
from barcode.writer import ImageWriter
from django.http import HttpResponse

class ListItemView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class AddItemView(generics.CreateAPIView):
    permission_classes=[IsAdminUser]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class DeleteItemView(APIView):
    permission_classes=[IsAdminUser]
    def delete(self, request):
        item_id = request.query_params.get('item_id')
        
        item = get_item_by_id(item_id)
        
        item.delete()

        return success_response(
            message="Successfully deleted the item"
        )   

class UpdateItemView(APIView):
    permission_classes=[IsAdminUser]
    def put(self, request):
        item_id = request.query_params.get('item_id')
        
        item = get_item_by_id(item_id)
        
        serializer = ItemSerializer(item, data=request.data, partial=True) 
        
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return success_response(
            message= "Successfully updated the item",
            item =  serializer.data)
    

class BarcodeView(APIView):
    permission_classes=[IsAdminUser]
    def get(self, request):
        item_id = request.query_params.get('item_id')
        item = get_item_by_id(item_id)

        #  Genetate the Bar Code
        buffer = BytesIO()
        barcode = Code128(item.sku, writer=ImageWriter())
        barcode.write(buffer)

        buffer.seek(0)
        return HttpResponse(buffer, content_type='image/png')

class UpdateQuantityView(APIView):
    def put(self, request):
        item_id = request.query_params.get('item_id')
        
        item = get_item_by_id(item_id)
        
        serializer = UpdateQuantitySerializer(item, data=request.data, partial=True) 
        
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return success_response(
            message= "Successfully updated the quantity",
            item =  serializer.data)


    

def get_item_by_id(item_id):
    if not item_id:
        raise ValidationError("item_id parameter required")
    try:
        return Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        raise NotFound("Item with provided item_id not found!")

