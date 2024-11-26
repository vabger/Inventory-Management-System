from django.core.management import call_command
from django.core.management.base import BaseCommand
from item.models import Location,Item
from user.models import User
import environ
import json
from django.apps import apps

env = environ.Env()
environ.Env.read_env()


app_config = apps.get_app_config('backend')  


app_path = app_config.path


class Command(BaseCommand):
    help = 'Populate the database with a fixed set of locations'

    def handle(self, *args, **kwargs):

        call_command("migrate")
        call_command("flush")

        self.stdout.write("Loading locations...")
        locations=[]
        aisles = 5
        rows = 5
        lvls = 5
        bins = 5
        for i in range(1, aisles + 1):
            for j in range(1,rows + 1):
                for k in range(1,lvls + 1):
                    for l in range(1,bins+ 1):
                        locations.append({"aisle":i,"row":j,"level":k,"bin":l})
    
        for loc in locations:
            Location.objects.get_or_create(**loc)
        self.stdout.write(self.style.SUCCESS('Locations populated successfully.'))

        User.objects.create_superuser(email = env('ADMIN_EMAIL'),username=env('ADMIN_NAME'),password=env('ADMIN_PASS'))
        
        self.stdout.write(self.style.SUCCESS('Admin user created successfully.'))


        self.stdout.write("Loading items from amazon_products.json...")
        
        with open(f"{app_path}/amazon_products.json", 'r') as f:
                product_data = json.load(f)
        
        for product in product_data:
            # Assuming your Item model has these fields; adjust if needed
            Item.objects.get_or_create(
                sku=product['sku'],
                name=product['name'],
                description=product.get('description', ''),
                price=product['price'],
                category = product['category']
            )
        self.stdout.write(self.style.SUCCESS(f"{len(product_data)} items populated successfully."))



