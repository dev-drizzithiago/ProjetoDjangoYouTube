import json
import os.path

from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from .models import DadosYoutube
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from .app_youtube import YouTubeDownload

ROOT_MIDIA_LOCAL_MUSIC = os.path.join(settings.MEDIA_ROOT, 'musics')
ROOT_MIDIA_LOCAL_MOVIE = os.path.join(settings.MEDIA_ROOT, 'movies')
STATIC_IMG = os.path.join(settings.STATIC_URL, 'img')

@ensure_csrf_cookie  # Garante que essa view seja acessada via GET antes de qualquer POST.
def index(request):

    query_links = DadosYoutube.objects.all()

    context = {
        'midia_local': ROOT_MIDIA_LOCAL_MUSIC.replace('\\', '/'),
        'img_btn_add': os.path.join(STATIC_IMG, 'adicionar.png'),
    }
    return render(request, 'index.html', context)

# @ensure_csrf_cookie
def add_link_sistema(request):
    dados_json = json.loads(request.body)  # Valor é um link do youtube
    link_registro = dados_json

    inicio_obj_yt_registro = YouTubeDownload()
    resultado_processo_validacao = inicio_obj_yt_registro.validar_link_youtube(link_registro)

    if resultado_processo_validacao:
        resultado_processo_add = inicio_obj_yt_registro.registrando_link_base_dados(link_registro)

        print(resultado_processo_add)

        return JsonResponse({
            'mensagem': resultado_processo_add,
        })
    else:
        return JsonResponse({
            'mensagem': 'Por favor, insira um link válido.',
        })

# @ensure_csrf_cookie
def download_link(request):
    dados_json = json.loads(request.body)

    return JsonResponse({
        'mensagem': 'mensaagem'
    })
def links_salvos(request):
    # Realiza a leitura dos dados que chegou do template
    dados_json = json.loads(request.body)

    lista_img = {
        'download': os.path.join(STATIC_IMG, 'download.png'),
        'remover': os.path.join(STATIC_IMG, 'remover.png'),
        'youtube': os.path.join(STATIC_IMG, 'youtube.png'),
    }

    # Faz a leitura dos dados que estão dentro do mysql
    query_info_links = DadosYoutube.objects.all().values().order_by('-base_ptr_id')

    # Retorna o valor, em forma de json, do query para o javascript do modelo.
    return JsonResponse({
        'send_json': list(query_info_links),
        'local_imgs': lista_img,
    })

# @ensure_csrf_cookie
def player_midias(request):
    lista_midias = list()
    dados_json = json.loads(request.body)
    dados_midia = os.listdir(ROOT_MIDIA_LOCAL_MOVIE)

    for midia in dados_midia:
        lista_midias.append({
            'nome_midia': midia.replace('.mp4', ''),
            'local_midia': os.path.join(settings.MEDIA_URL, 'movies', midia).replace('\\', '/'),
        })

    lista_img = {
        'botao_play': os.path.join(STATIC_IMG, 'botao-play.png').replace('\\', '/'),
        'remover': os.path.join(STATIC_IMG, 'remover.png').replace('\\', '/'),
        'youtube': os.path.join(STATIC_IMG, 'youtube.png').replace('\\', '/'),
    }

    return JsonResponse({
        'data_midia': lista_midias,
        'lista_img': lista_img,
    })
