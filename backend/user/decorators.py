from django.contrib.auth.models import AnonymousUser
from functools import wraps
from rest_framework_simplejwt.tokens import AccessToken
from .models import User
from backend.utils import error_response

# Decorator to check if the user is logged in 
def login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                access_token = AccessToken(token)
                user_id = access_token.get('user_id')
                request.user = User.objects.get(id=user_id)
            except Exception as e:
                return error_response(
                    error =  "Invalid token or user not found.", status=401)
        else:
            return error_response(
                    error = "Authentication Credentials not provided", status=401)
        
        if isinstance(request.user, AnonymousUser):
            return error_response(
                error="User not authenticated.", 
                status=401)
        
        return view_func(self,request, *args, **kwargs)
    
    return _wrapped_view

# Decorator to check if the user is an admin
def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                access_token = AccessToken(token)
                user_id = access_token.get('user_id')
                request.user = User.objects.get(id=user_id)
            except Exception as e:
                return error_response(
                    error =  "Invalid token or user not found.", status=401)
        else:
            return error_response(
                    error = "Authentication Credentials not provided", status=401)
        
        if isinstance(request.user, AnonymousUser):
            return error_response(
                error="User not authenticated.", 
                status=401)
        
        if request.user.role != 'admin':
            return error_response(
                error="You do not have permission to access this resource.", 
                status=403)
        
        return view_func(self,request, *args, **kwargs)
    
    return _wrapped_view
