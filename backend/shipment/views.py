from django.db import transaction
from rest_framework.permissions import IsAdminUser
from .models import Shipment
from .serializers import ShipmentSerializer,ShipmentResponseSerializer
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

from item.models import Location, ItemLocation
from user.models import User

from backend.utils import success_response


def find_location_inbound(item_id):
    """
        finds the location for an inbound item
    """
    empty_location = Location.objects.filter(item_locations__isnull=True).first()
    if empty_location:
        return empty_location

    low_usage_location = (
        ItemLocation.objects.filter(item_id=item_id)
        .order_by('quantity')
        .first()
    )
    if low_usage_location:
        return low_usage_location.location
    
    raise ValueError("No suitable location found for inbound item.") 

def find_location_outbound(item_id, quantity_needed):
    """
        finds the location for outgoing item
    """
    item_locations = ItemLocation.objects.filter(item_id=item_id, quantity__gte=quantity_needed).order_by('-quantity')

    if item_locations.exists():
        return item_locations.first().location

    raise ValueError(f"No location found with sufficient stock for item {item_id}.")

# Create your views here.
class ShipmentListCreateView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        shipments = Shipment.objects.all()
        serializer = ShipmentResponseSerializer(shipments,many=True)
        return success_response(message="List of Shipments",shipments=serializer.data)

    def post(self, request):
        serializer = ShipmentSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        type = serializer.validated_data.get('type')
        items = serializer.validated_data.get('items')
        serializer.validated_data['created_by'] = request.user
        for item in items:
            if type==Shipment.Type.INBOUND:
                item['location'] = find_location_inbound(item.get('item').id)
            elif type==Shipment.Type.OUTBOUND:
                item['location'] = find_location_outbound(item.get('item').id,item.get('quantity'))
        
        serializer.save()
        
        return success_response(message="Shipment created successfully",shipment=serializer.data)


class AssignShipmentToWorkerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        shipment_id = request.data.get('shipment_id')
        try:
            shipment = Shipment.objects.get(id=shipment_id)
        except User.DoesNotExist:
            raise ValidationError("Shipment does not exist.")

        if shipment.status != Shipment.Status.PENDING:
            raise ValidationError("Shipment status must be pending.")

        worker_id = request.data.get('worker_id')
        
        try:
            worker = User.objects.get(id=worker_id)
        except User.DoesNotExist:
            raise ValidationError("Worker does not exist.")

        # Assign the worker and update the status
        shipment.assigned_to = worker
        shipment.status = Shipment.Status.ASSIGNED
        shipment.save()

        return success_response(
            message="Shipment assigned to worker successfully.",
            shipment=ShipmentResponseSerializer(shipment).data
        )


class WorkerAssignedShipmentsView(APIView):

    def get(self, request):
        """
        Retrieves shipments assigned to the logged-in worker.
        """
        worker = request.user
  
        shipments = Shipment.objects.filter(assigned_to=worker).order_by('-created_at')
        serializer = ShipmentResponseSerializer(shipments,many=True)
        return success_response(message="List of assigned shipments", shipments=serializer.data)


class CompleteShipmentView(APIView):

    def post(self, request):
        with transaction.atomic():
            shipment_id = request.data.get('shipment_id')
            shipment = Shipment.objects.get(id=shipment_id, assigned_to=request.user)

            if shipment.status != Shipment.Status.IN_PROGRESS:
                raise ValidationError("Shipment status must be in progress.")

            for shipment_item in shipment.items.all():
                if shipment.type == Shipment.Type.INBOUND:
                    shipment_item.process_inbound()
                elif shipment.type == Shipment.Type.OUTBOUND:
                    shipment_item.process_outbound()

            shipment.status = Shipment.Status.COMPLETED
            shipment.save()

            return success_response(
                message="Shipment completed successfully.",
                shipment=ShipmentResponseSerializer(shipment).data
            )

class DeleteShipmentView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request):
        shipment_id = request.data.get('shipment_id')
        try:
            shipment = Shipment.objects.get(id=shipment_id)
        except Shipment.DoesNotExist:
            raise ValidationError("Shipment does not exist.")

        if shipment.status not in [Shipment.Status.PENDING, Shipment.Status.ASSIGNED]:
            raise ValidationError("Only pending or assigned shipments can be deleted.")

        shipment.delete()
        return success_response(message="Shipment deleted successfully.")


class InProgressShipmentView(APIView):

    def post(self, request):
        shipment_id = request.data.get('shipment_id')

        try:
            shipment = Shipment.objects.get(id=shipment_id, assigned_to=request.user)
        except Shipment.DoesNotExist:
            raise ValidationError("Shipment not found or not assigned to you.")

        if shipment.status != Shipment.Status.ASSIGNED:
            raise ValidationError("Shipment must be in assigned status to mark it as in progress.")

        shipment.status = Shipment.Status.IN_PROGRESS
        shipment.save()

        return success_response(
            message="Shipment marked as in progress successfully.",
            shipment=ShipmentResponseSerializer(shipment).data
        )
        

    


