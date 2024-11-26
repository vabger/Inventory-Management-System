from django.core.management.base import BaseCommand
from item.models import Location
from user.models import User
import environ

env = environ.Env()
environ.Env.read_env()


class Command(BaseCommand):
    help = 'Populate the database with a fixed set of locations'

    def handle(self, *args, **kwargs):
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
