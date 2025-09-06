from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import index, add_link_sistema, links_salvos, player_midias

urlpatterns = [

    path('', index, name='index'),
    path('add_link_sistema/', add_link_sistema, name='add_link_sistema'),
    path('links_salvos/', links_salvos, name='links_salvos'),
    path('player_midias/', player_midias, name='player_midias'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
