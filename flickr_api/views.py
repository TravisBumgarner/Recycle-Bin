from django.shortcuts import redirect
from .functions import get_request_token, get_access_token


def request_token(request):
    response = get_request_token()
    return response

def access_token(request):
    response = get_access_token(request)
    return response