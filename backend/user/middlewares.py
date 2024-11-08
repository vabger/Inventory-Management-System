from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from .models import User

class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                access_token = AccessToken(token)
                user_id = access_token.get('user_id')
                request.user = User.objects.get(id=user_id)
            except Exception as e:
                print(e)
                request.user = AnonymousUser() 
        else:
            request.user = AnonymousUser() 

        response = self.get_response(request)
        return response
