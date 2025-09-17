from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    index, add_link_sistema, links_salvos,
    player_midias_mp4, download_link, player_midias_mp3, login)

urlpatterns = [

    path('', index, name='index'),
    path('add_link_sistema/', add_link_sistema, name='add_link_sistema'),
    path('links_salvos/', links_salvos, name='links_salvos'),
    path('player_midias_mp4/', player_midias_mp4, name='player_midias_mp4'),
    path('player_midias_mp3/', player_midias_mp3, name='player_midias_mp3'),
    path('download_link/', download_link, name='download_link'),
    path('login/', login, name='login'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
