from django.db import models, transaction
from user.models import User
import uuid

class Location(models.Model):

    aisle = models.CharField(max_length=10, help_text="Aisle identifier, e.g., A1")
    row = models.CharField(max_length=10, help_text="Row identifier, e.g., R1")
    level = models.CharField(max_length=10, help_text="Level identifier, e.g., L2")
    bin = models.CharField(max_length=10, help_text="Bin identifier, e.g., B3")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('aisle', 'row', 'level', 'bin')  # Ensure each location is unique

    def __str__(self):
        return f"Aisle {self.aisle}, Row {self.row}, Level {self.level}, Bin {self.bin}"
    


class Item(models.Model):
    class Category(models.TextChoices):
        ELECTRONICS = 'Electronics', 'Electronics'
        CLOTHING = 'Clothing', 'Clothing'
        FURNITURE = 'Furniture', 'Furniture'
        GROCERIES = 'Groceries', 'Groceries'
        TOYS = 'Toys', 'Toys'
        BOOKS = 'Books', 'Books'
        OTHERS = 'Others', 'Others'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=100, unique=True, help_text="Stock Keeping Unit identifier")
    total_quantity= models.PositiveIntegerField(default=0)
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.OTHERS,
        help_text="Category of the item"
    )
    image = models.ImageField(upload_to='item_images/', blank=True, null=True)
    minimum_stock_level = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (SKU: {self.sku}) - {self.get_category_display()}"
    
    def is_below_minimum_stock(self):
        return self.total_quantity < self.minimum_stock_level
    
class ItemLocation(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='item_locations')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='item_locations')
    quantity = models.PositiveIntegerField(default=0, help_text="Quantity of the item at this location")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('item', 'location')

    def __str__(self):
        return f"{self.item.name} at {self.location} - {self.quantity} units"
    
    def add_stock(self, quantity, performed_by=None):
        with transaction.atomic():
            if quantity <= 0:
                raise ValueError("Quantity to add must be positive.")
            
            self.quantity += quantity
            self.save()

            StockTransaction.objects.create(
                item=self.item,
                location=self.location,
                quantity=quantity,
                transaction_type='add',
                performed_by=performed_by
            )

    def remove_stock(self, quantity, performed_by=None):
        with transaction.atomic():
            if quantity <= 0:
                raise ValueError("Quantity to remove must be positive.")
            if self.quantity < quantity:
                raise ValueError("Insufficient stock in the warehouse.")
            
            if self.quantity < quantity:
                    raise ValueError("Insufficient stock at the specified location.")
            
            self.quantity -= quantity
            self.save()

            StockTransaction.objects.create(
                item=self.item,
                location=self.location,
                quantity=-quantity,
                transaction_type='remove',
                performed_by=performed_by
            )

    



class StockTransaction(models.Model):
    item = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='transactions')
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(help_text="Positive for additions, negative for removals")
    transaction_type = models.CharField(
        max_length=50,
        choices=[
            ('add', 'Add Stock'),
            ('remove', 'Remove Stock'),
            ('transfer', 'Transfer Stock'),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, help_text="User who performed the action")

    def __str__(self):
        return f"{self.transaction_type.capitalize()} {self.quantity} for {self.item.name} on {self.created_at}"

