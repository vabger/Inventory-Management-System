from functools import wraps
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework.exceptions import ParseError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from django.db import IntegrityError

def exception_handler(func):
    @wraps(func)
    def wrapper(request,*args,**kwargs):
        try:
            return func(request,*args,**kwargs)
        except ParseError:
            return error_response(
                error="Invalid JSON request body",
                status=400
            )
        except IntegrityError as e:
            return error_response(
                error="Invalid object",
                status=400
            )
        except ValidationError as e:
            return error_response(
                error=e.detail,
                status=400
            )
        except ObjectDoesNotExist:
            return error_response(
                error="Object not found",
                status=404
            )
        except Exception as e:
            print(e)
            return error_response(
                error="Something unexpected happened on the server",
                status=500
            )
    return wrapper


class MyModelSerializer(serializers.ModelSerializer):

    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)

        valid = super().is_valid()

        if not valid:
            raise ValidationError(self.errors)
        
class MySerializer(serializers.Serializer):

    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)

        valid = super().is_valid()

        if not valid:
            raise ValidationError(self.errors)
        
def success_response(message,status = 200,**kwargs):
    response = {"message":message}
    response.update(kwargs)
    return Response(response,status)

def error_response(error,status = 400,**kwargs):
    response = {"error":error}
    response.update(kwargs)
    return Response(response,status)