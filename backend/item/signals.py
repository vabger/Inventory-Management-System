from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.tasks import send_email_task
from .models import Item,ItemLocation
from user.models import User


@receiver(post_save, sender=Item)
def check_stock_level(sender, instance, **kwargs):
    if instance.is_below_minimum_stock():

        staff_emails = list(User.objects.filter(is_staff=True).values_list('email', flat=True))

        send_email_task.delay(
            'Low Stock Alert',
            f'The stock for {instance.name} (SKU: {instance.sku}) is below the minimum level.',
            staff_emails
        )

@receiver(post_save,sender=ItemLocation)
def update_total_quant(sender,instance,**kwargs):
    instance.item.total_quantity = 0
    for item_location in instance.item.item_locations.all():
        instance.item.total_quantity += item_location.quantity
    instance.item.save()