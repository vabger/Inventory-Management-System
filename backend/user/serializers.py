from backend.utils import MySerializer,MyModelSerializer
from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import check_password, make_password

class UserSerializer(MyModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        
        user = super().create(validated_data)
        
        if password:
            user.password = make_password(password)
            user.save()
        
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        instance = super().update(instance, validated_data)
        
        if password:
            instance.password = make_password(password) 
            instance.save()
        return instance

class LoginSerializer(MySerializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password")

        data['user'] = user
        return data
