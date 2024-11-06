from functools import wraps
from rest_framework.response import Response

def exception_handler(func):
    @wraps(func)
    def wrapper(request,*args,**kwargs):
        try:
            return func(request,*args,**kwargs)
        except Exception as e:
            return Response({"error":"Something Unexpected happened on the server"},500)
    return wrapper