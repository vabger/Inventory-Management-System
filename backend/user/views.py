from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user_data = UserSerializer(user).data
            refresh_token = RefreshToken.for_user(user)
            return Response({"message":"Login Successful",'refresh_token':str(refresh_token),'access_token':str(refresh_token.access_token),"user":user_data}, 200)

        return Response({'error':serializer.errors}, 400)

