import json
from django.shortcuts import render


# Create your views here.

def index(request):
    return render(request, 'index.html')


def add_link_sistema(request):
    dados_json = json.loads(request.body)
    print(dados_json)
