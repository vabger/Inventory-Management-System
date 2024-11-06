from functools import wraps
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

def exception_handler(func):
    @wraps(func)
    def wrapper(request,*args,**kwargs):
        try:
            return func(request,*args,**kwargs)
        except ValidationError as e:
            return Response({'error': e.detail}, 400)
        except ObjectDoesNotExist:
            return Response({'error': 'Object not found'},404)
        except Exception as e:
            print(e)
            return Response({"error":"Something Unexpected happened on the server"},500)
    return wrapper


class MySerializer(serializers.Serializer):

    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)
        
        valid = super().is_valid()

        if not valid:
            raise ValidationError(self.errors)