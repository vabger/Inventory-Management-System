from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ParseError, PermissionDenied, MethodNotAllowed, NotFound
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework.views import exception_handler
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    print(type(exc))
    print(exc)
    if isinstance(exc, ParseError):
        return error_response(
            error="Invalid JSON request body",
            status=status.HTTP_400_BAD_REQUEST
        )
    elif isinstance(exc, IntegrityError):
        return error_response(
            error="Invalid object",
            status=status.HTTP_400_BAD_REQUEST
        )
    elif isinstance(exc, ValidationError):
        return error_response(
            error=exc.messages[0], 
            status=status.HTTP_400_BAD_REQUEST
        )
    elif isinstance(exc, ObjectDoesNotExist):
        return error_response(
            error="Object not found",
            status=status.HTTP_404_NOT_FOUND
        )
    elif isinstance(exc,PermissionDenied):
        return error_response(
            error="You don't have the permission to access this resource",
            status=status.HTTP_403_FORBIDDEN
        )
    elif isinstance(exc,MethodNotAllowed):
        return error_response(
            error=exc.detail,
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    elif isinstance(exc,InvalidToken):
        return error_response(
            error=exc.detail,
            status=status.HTTP_400_BAD_REQUEST
        )
    elif isinstance(exc,AuthenticationFailed):
        return error_response(
            error=exc.detail,
            status=status.HTTP_400_BAD_REQUEST
        )
    elif isinstance(exc,NotFound):
        return error_response(
            error=exc.detail,
            status=status.HTTP_404_NOT_FOUND
        )

    elif response is None:
        return error_response(
            error="Something unexpected happened on the server",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response


        
def success_response(message,status = 200,**kwargs):
    response = {"message":message}
    response.update(kwargs)
    return Response(response,status)

def error_response(error,status = 400,**kwargs):
    response = {"error":error}
    response.update(kwargs)
    return Response(response,status)