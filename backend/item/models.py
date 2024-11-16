from django.db import models
import uuid

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
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=100, unique=True, help_text="Stock Keeping Unit identifier")
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.OTHERS,
        help_text="Category of the item"
    )
    image = models.ImageField(upload_to='item_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (SKU: {self.sku}) - {self.get_category_display()}"