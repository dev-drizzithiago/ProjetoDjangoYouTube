from django.db import models

# Create your models here.

class Base(models.Model):
    data_criacao = models.DateField(auto_created=True)
class DadosYtoutube(Base):
    autor_link = models.CharField(max_length=255)
    titulo_link = models.CharField(max_length=255)
    duracao_link = models.IntegerField()
    miniatura_link = models.CharField(max_length=255)
    download_link = models.CharField(max_length=255)
