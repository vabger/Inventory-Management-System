from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer, DeleteSerializer
from backend.utils import success_response
from rest_framework.exceptions import ValidationError
from .models import User
from rest_framework.permissions import AllowAny, IsAdminUser

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = User.objects.filter(username=username).first()
        
        if not user or not user.check_password(password):
            raise ValidationError("Invalid username or password")


        refresh_token = RefreshToken.for_user(user)

        return success_response(
            message="Login Successful", 
            status=200, 
            refresh_token=str(refresh_token), 
            access_token=str(refresh_token.access_token),
            is_staff = user.is_staff,
            username = user.username,
            email = user.email
        )

class RegisterView(APIView):
    permission_classes = [IsAdminUser]

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


class UserListView(APIView):
    permission_classes=[IsAdminUser]
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return success_response(
            message="User list retrieved successfully",
            status=200,
            users=serializer.data
        )

class UserDeleteView(APIView):
    permission_classes = [IsAdminUser]
    def delete(self, request):
        serializer = DeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_id = serializer.validated_data['user_id']

        user = User.objects.get(id=user_id)
        user.delete()
        return success_response(
            message="User deleted successfully",
            status=204
        )


