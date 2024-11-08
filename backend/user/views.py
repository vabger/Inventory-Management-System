from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer
from backend.utils import exception_handler, success_response
from rest_framework.exceptions import ValidationError
from .models import User
from .decorators import admin_required

class LoginView(APIView):
    @exception_handler
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh_token = RefreshToken.for_user(user)

        return success_response(
            message="Login Successful", 
            status=200, 
            refresh_token=str(refresh_token), 
            access_token=str(refresh_token.access_token), 
        )

class RegisterView(APIView):
    @exception_handler
    @admin_required
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        return success_response(
            message="User created successfully",
            status=201,
        )

