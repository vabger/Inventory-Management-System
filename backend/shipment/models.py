from django.db import models

from django.db import models
from item.models import Item, Location, ItemLocation
from user.models import User

import uuid

class Shipment(models.Model):
    class Type(models.TextChoices):
        INBOUND = 'Inbound', 'Inbound'
        OUTBOUND = 'Outbound', 'Outbound'

    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        ASSIGNED = 'Assigned', 'Assigned'
        IN_PROGRESS = 'In Progress', 'In Progress'
        COMPLETED = 'Completed', 'Completed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=10, choices=Type.choices)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="created_shipments")
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="assigned_shipments")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} Shipment #{self.id} - {self.status}"


class ShipmentItem(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, help_text="Location for inbound/outbound operations")

    def __str__(self):
        return f"{self.quantity} x {self.item.name} ({self.shipment})"

    def process_inbound(self):
        if not self.location:
            raise ValueError("Location must be specified for inbound shipments.")
        item_location , _ = ItemLocation.objects.get_or_create(item=self.item, location=self.location)
        item_location.add_stock(self.quantity, performed_by=self.shipment.assigned_to)

    def process_outbound(self):
        if not self.location:
            raise ValueError("Location must be specified for outbound shipments.")
        item_location = ItemLocation.objects.get(item=self.item, location=self.location)
        item_location.remove_stock(self.quantity, performed_by=self.shipment.assigned_to)

