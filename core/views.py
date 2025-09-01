import json
import os.path

from django.shortcuts import render
from django.http import JsonResponse


# Create your views here.
MIDIA_LOCAL = os.path.join()
def index(request):
    midia_local =
    context = {
        'midia_local': midia_local
    }
    return render(request, 'index.html')


def add_link_sistema(request):
    dados_json = json.loads(request.body)
    print(dados_json)

    return JsonResponse({
        'mesage': 'Teste'
    })
