from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(choices=[("worker","worker"),("admin","admin")],default="worker")
    created_at = models.DateTimeField(auto_now_add=True)
    
