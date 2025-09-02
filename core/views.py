import json
import os.path

from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

midia = 'Dreams (2004 Remaster).mp4'

# Create your views here.
MIDIA_LOCAL = os.path.join(settings.MEDIA_URL, 'movies', midia)
def index(request):

    context = {
        'midia_local': MIDIA_LOCAL.replace('\\', '/')
    }
    return render(request, 'index.html', context)


def add_link_sistema(request):

    dados_json = json.loads(request.body)
    print(dados_json)

    return JsonResponse({
        'mesage': 'Teste'
    })
