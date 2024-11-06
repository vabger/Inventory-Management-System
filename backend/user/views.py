from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer
from backend.utils import exception_handler, success_response
from .models import User

class LoginView(APIView):
    @exception_handler
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
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
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        serializer.save()
        return success_response(
            message="User created successfully",
            status=201,
        )

