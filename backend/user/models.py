from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


# Creating a Custom User Manager to manage our custom User model
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')  # Default to admin role for superuser
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser):
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(choices=[("worker", "worker"), ("admin", "admin")], default="worker")
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username','password']

    # Added this to link the custom user manager
    objects = CustomUserManager()
