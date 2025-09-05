import json
import os.path

from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from .models import DadosYoutube

from .app_youtube import YouTubeDownload
midia = 'Dreams (2004 Remaster).mp4'

# Create your views here.
MIDIA_LOCAL = os.path.join(settings.MEDIA_URL, 'movies', midia)
def index(request):

    query_links = DadosYoutube.objects.all()

    context = {
        'midia_local': MIDIA_LOCAL.replace('\\', '/'),
        'lista_links': query_links,
    }
    return render(request, 'index.html', context)


def add_link_sistema(request):
    dados_json = json.loads(request.body)  # Valor é um link do youtube
    link_registro = dados_json

    inicio_obj_yt_registro = YouTubeDownload()
    resultado_processo_validacao = inicio_obj_yt_registro.validar_link_youtube(link_registro)

    if resultado_processo_validacao:
        resultado_processo_add = inicio_obj_yt_registro.registrando_link_base_dados(link_registro)
        return JsonResponse({
            'mensagem': resultado_processo_add,
        })
    else:
        return JsonResponse({
            'mensagem': 'Por favor, insira um link válido.',
        })

def links_salvos(request):
    dados_json = json.loads(request.body)

    query_info_links = DadosYoutube.objects.all().order_by('-base_ptr_id')

    return render(request, "links_salvos.html", context=query_info_links)
