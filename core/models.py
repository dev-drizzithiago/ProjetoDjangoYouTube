from django.db import models

# Create your models here.

class Base(models.Model):
    data_criacao = models.DateField('data_criacao', auto_now_add=True)

class DadosYoutube(Base):
    autor_link = models.CharField(max_length=255)
    titulo_link = models.CharField(max_length=255)
    duracao = models.IntegerField()
    miniatura = models.CharField(max_length=255)
    link_tube = models.CharField(max_length=255)
