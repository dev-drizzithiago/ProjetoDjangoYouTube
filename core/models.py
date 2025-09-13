import os.path

from django.db import models
from django.conf import settings

# Create your models here.

class Base(models.Model):
    data_criacao = models.DateField('data_criacao', auto_now_add=True)

class DadosYoutube(Base):
    id_link = models.IntegerField(primary_key=True, unique=True)
    autor_link = models.CharField(max_length=255)
    titulo_link = models.CharField(max_length=255)
    duracao = models.IntegerField()
    miniatura = models.CharField(max_length=255)
    link_tube = models.CharField(max_length=255)

class MoviesSalvasServidor(Base):
    id_miniatura = models.IntegerField(primary_key=True, unique=True)
    nome_arquivo = models.CharField(max_length=255, null=True)
    path_arquivo = models.CharField(max_length=255, null=True)
    duracao_midia = models.IntegerField()
    path_miniatura = models.FileField(upload_to='miniaturas/', max_length=255)
    id_dados_yt = models.ForeignKey(DadosYoutube)
