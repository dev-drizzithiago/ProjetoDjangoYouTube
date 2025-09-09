"""
from pytubefix import Search

results = Search('GitHub Issue Best Practices')

for video in results.videos:
    print(f'Title: {video.title}')
    print(f'URL: {video.watch_url}')
    print(f'Duration: {video.length} sec')
    print('---')

Title: Good Practices with GitHub Issues
URL: https://youtube.com/watch?v=v1AeHaopAYE
Duration: 406 sec
---
Title: GitHub Issues Tips and Guidelines
URL: https://youtube.com/watch?v=kezinXSoV5A
Duration: 852 sec
---
Title: 13 Advanced (but useful) Git Techniques and Shortcuts
URL: https://youtube.com/watch?v=ecK3EnyGD8o
Duration: 486 sec
---
Title: Managing a GitHub Organization Tools, Tips, and Best Practices - Mark Matyas
URL: https://youtube.com/watch?v=1T4HAPBFbb0
Duration: 1525 sec
---
Title: Do you know the best way to manage GitHub Issues?
URL: https://youtube.com/watch?v=OccRyzAS4Vc
Duration: 534 sec
---

"""
import os.path

from .models import DadosYoutube
from django.conf import settings


from os import path, listdir, makedirs, remove, system

from pathlib import Path
from re import search
from time import sleep

from moviepy import AudioFileClip
from pytubefix import YouTube
from pytubefix.cli import on_progress
from pytubefix import Playlist

import sqlite3
import re


def on_progress_(stream, chunk, bytes_remaining):
    total_size = stream.filesize
    bytes_download = total_size - bytes_remaining
    porcentagem = (bytes_download / total_size) * 100
    print(f'Download: {porcentagem:.2f} concluido...')

def validacao_nome_arquivo(filename):
    """
    Corrige o nome, remove os caracteres especiais, evita os erros na criação
    :param filename: recebe o nome do arquivo, caso tenha erro, arquivo será corrigido.
    :return:
    """
    return re.sub(r'[\/:*?"<>|]', '-', filename)

class YouTubeDownload:

    PATH_MIDIA_MOVIES = os.path.join(settings.MEDIA_ROOT, 'movies')
    PATH_MIDIA_MUSICS = os.path.join(settings.MEDIA_ROOT, 'musics')
    PATH_MIDIA_TEMP  = os.path.join(settings.MEDIA_ROOT, 'temp')

    def __init__(self):
        self.link = None
        self.conexao_banco = None
        self.cursor = None
        self._auto_link = None
        self._titulo_link = None
        self._duracao = None
        self._miniatura = None
        self._link_tube = None

    # Registra o link na base de dados.
    def registrando_link_base_dados(self, link):

        youtube = YouTube(link)

        dados_link = DadosYoutube(
            autor_link=youtube.author,
            titulo_link=youtube.title,
            duracao=youtube.length,
            miniatura=youtube.thumbnail_url,
            link_tube=youtube.watch_url,
        )
        try:
            resultado = dados_link.save()
            return f'Link salvo na base de dados com sucesso'
        except Exception as error:
            return f'Dados não foram salvos: {error}'

    def removendo_link_base_dados(self):
        """
        Metódo responsável por remover o link da base de dados.
        :param link_remove: Recebe o valor do número do id do link.
        :return: Retorna a confirmação que o link foi deletado.
        """

    # Faz download do arquivo em MP3.
    def download_music(self, link):

        download_yt = YouTube(link, on_progress_callback=on_progress_)
        stream = download_yt.streams.get_audio_only()
        stream.download(self.PATH_MIDIA_TEMP)

        # Chama o app para transformar o arquivo m4a(audio) em mp3(audio)
        self.mp4_to_mp3(autor_midia=download_yt.author)

    # Faz o download do arquivo em MP4
    def download_movie(self):
        download_yt = YouTube(self.link, on_progress_callback=on_progress_)
        stream = download_yt.streams.get_highest_resolution()
        stream.download(self.PATH_MIDIA_MOVIES)

    # Processo para transformar o arquivo de mp4 em mp3
    # Esse problema não tem nenhum não pode ser chamado pelo usuário, apenas para uso internet do app
    def mp4_to_mp3(self, autor_midia):

        for arquivo_m4a in listdir(self.PATH_MIDIA_TEMP):
            if search('m4a', arquivo_m4a):
                m4a_file_abs = path.join(self.PATH_MIDIA_TEMP, arquivo_m4a)

                # valida os nomes do arquivo, removendo os caracteres especiais, caso tenham.
                nome_arquivo_m4a_validado = validacao_nome_arquivo(arquivo_m4a)
                autor_validado = validacao_nome_arquivo(autor_midia)

                mp3_file = path.join(
                    self.PATH_MIDIA_MUSICS, f"{autor_validado}_{arquivo_m4a.replace('m4a', 'mp3')}"
                )

                """#### Processa o MP4 para MP3"""
                novo_mp3 = AudioFileClip(m4a_file_abs)
                novo_mp3.write_audiofile(mp3_file)
                remove(m4a_file_abs)

    # Valida se o link é valido.
    def validar_link_youtube(self, link):

        if 'https://' not in link[:9]:
            link = f'https://{link}'

        if 'www.' not in link[:13]:
            link = f'{link[:8]}www.{link[8:]}'

        if link[:23] != 'https://www.youtube.com':
            return False
        else:
            return True


