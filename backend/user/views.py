from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer
from backend.utils import exception_handler


class LoginView(APIView):
    @exception_handler
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        user = serializer.validated_data['user']

        user_data = UserSerializer(user).data
        refresh_token = RefreshToken.for_user(user)

        return Response({"message":"Login Successful",'refresh_token':str(refresh_token),'access_token':str(refresh_token.access_token),"user":user_data}, 200)

