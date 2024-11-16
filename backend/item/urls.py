from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path("", ListItemView.as_view(), name="list_item"),
    path("add",AddItemView.as_view(),name="add_item"),
    path("delete",DeleteItemView.as_view(),name="delete_item"),
    # path("filter",FilterItemView.as_view(),name="filter_item"),
    path("update",UpdateItemView.as_view(),name="update_item"),
    path("barcode", BarcodeView.as_view(),name="barcode"),
    path("update_quant",UpdateQuantityView.as_view(),name="update_quantity")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

