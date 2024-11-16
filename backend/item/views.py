from rest_framework import generics
from rest_framework.views import APIView
from .models import Item
from .serializers import ItemSerializer
from rest_framework.serializers import ValidationError
from rest_framework.exceptions import NotFound
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from backend.utils import success_response

from io import BytesIO
from barcode import Code128
from barcode.writer import ImageWriter
from django.http import HttpResponse

class ListItemView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class AddItemView(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class DeleteItemView(APIView):
    def delete(self, request, *args, **kwargs):
        item_id = request.query_params.get('item_id')
        
        item = get_item_by_id(item_id)
        
        item.delete()

        return success_response(
            message="Successfully deleted the item"
        )   

class UpdateItemView(APIView):

    def put(self, request, *args, **kwargs):
        item_id = request.query_params.get('item_id')
        
        item = get_item_by_id(item_id)
        
        serializer = ItemSerializer(item, data=request.data, partial=True) 
        
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return success_response(
            message= "Successfully updated the item",
            item =  serializer.data)
    

class BarcodeView(APIView):
    def get(self, request, *args, **kwargs):
        item_id = request.query_params.get('item_id')
        item = get_item_by_id(item_id)

        #  Genetate the Bar Code
        buffer = BytesIO()
        barcode = Code128(item.sku, writer=ImageWriter())
        barcode.write(buffer)

        buffer.seek(0)
        return HttpResponse(buffer, content_type='image/png')

    

def get_item_by_id(item_id):
    if not item_id:
        raise ValidationError("item_id parameter required")
    try:
        return Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        raise NotFound("Item with provided item_id not found!")


# class FilterItemView(generics.ListAPIView):
#     queryset = Item.objects.all()
#     serializer_class = ItemSerializer
#     filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
#     filterset_fields = ['name', 'sku', 'price']
#     search_fields = ['name', 'description', 'sku']
#     ordering_fields = ['price', 'quantity', 'created_at']
