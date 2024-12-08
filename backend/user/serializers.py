from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username", "email","is_staff", "password"]

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class DeleteSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    
    

