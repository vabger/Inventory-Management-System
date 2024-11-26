from django.urls import path
from .views import ShipmentListCreateView, AssignShipmentToWorkerView, WorkerAssignedShipmentsView, CompleteShipmentView,DeleteShipmentView, InProgressShipmentView

urlpatterns = [
    path('', ShipmentListCreateView.as_view(), name='shipment-list-create'),  
    path('assign-worker', AssignShipmentToWorkerView.as_view(), name='assign-worker'),
    path('view', WorkerAssignedShipmentsView.as_view(), name='worker-assigned-shipments'),
    path('complete',CompleteShipmentView.as_view(),name='complete-shipment'),
    path('delete',DeleteShipmentView.as_view(),name='delete-shipment'),
    path('in-progress', InProgressShipmentView.as_view(),name='in-progress-shipment'),  
]
