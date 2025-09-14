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

from .models import DadosYoutube, MoviesSalvasServidor
from django.conf import settings
from django.core.files.base import ContentFile

from os import path, listdir, remove
from pathlib import Path
from re import search

from moviepy import AudioFileClip
from pytubefix import YouTube

import requests

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
    PATH_MIDIA_MOVIES_URL = os.path.join(settings.MEDIA_URL, 'movies')
    PATH_MIDIA_MUSICS = os.path.join(settings.MEDIA_ROOT, 'musics')
    PATH_MIDIA_TEMP = os.path.join(settings.MEDIA_ROOT, 'temp')

    def __init__(self):
        self.link = None
        self.conexao_banco = None
        self.cursor = None
        self._auto_link = None
        self._titulo_link = None
        self._duracao = None
        self._miniatura = None
        self._link_tube = None
        self._usuario = None

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
            dados_link.save()
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
    def download_music(self, link: str):
        download_yt = YouTube(link, on_progress_callback=on_progress_)
        stream = download_yt.streams.get_audio_only()
        stream.download(self.PATH_MIDIA_TEMP)

        # Chama o app para transformar o arquivo m4a(audio) em mp3(audio)
        self.mp4_to_mp3(autor_midia=download_yt.author)

    # Faz o download do arquivo em MP4
    def download_movie(self, id_entrada: int):
        """
        ** Se você colocasse save=True, o Django salvaria o objeto video imediatamente após salvar o arquivo,
        o que pode ser indesejado se o objeto ainda estiver incompleto ou se você quiser controlar melhor
        o momento do save().
        :param id_entrada: Recebe o id para ser feito uma query na base de dados
        :return: Mensagem de sucesso quando finalizar o download do vídeo.
        """
        try:

            query_validador_dados = DadosYoutube.objects.filter(id_dados=id_entrada).values()
            for item in query_validador_dados:
                id_dados = item['id_dados']
                link_tube = item['link_tube']

            download_yt = YouTube(link_tube)

            nome_midia = validacao_nome_arquivo(f"{download_yt.author}_{download_yt.title}.mp4")
            ducarao_midia = f"{download_yt.length}"
            miniatura = download_yt.thumbnail_url
            path_midia = str(Path(self.PATH_MIDIA_MOVIES_URL, nome_midia)).replace('\\', '/')

            query_validador_midia = MoviesSalvasServidor.objects.filter(nome_arquivo=nome_midia)

            if query_validador_midia.exists():
                return f'Midia já existe'
            else:
                response = requests.get(miniatura)

                video = MoviesSalvasServidor(
                    nome_arquivo=nome_midia,
                    path_arquivo=path_midia,
                    duracao_midia=ducarao_midia,
                    dados_youtube_id=id_dados,
                )
                video.path_miniatura.save(
                    f'{nome_midia.replace('.mp4', '')}.png',
                    ContentFile(response.content),
                    save=False  # **
                )
                video.save()

                stream = download_yt.streams.get_highest_resolution()
                stream.download(output_path=self.PATH_MIDIA_MOVIES, filename=validacao_nome_arquivo(nome_midia))
                return f'Download do vídeo realizado com sucesso'

        except FileExistsError as error:
            return f"Erro no download do vídeo: {error}"

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


