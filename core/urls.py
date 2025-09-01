from django.urls import path
from .views import index, add_link_sistema

urlpatterns = [
    path('', index, name='index'),
    path('add_link_sistema/', add_link_sistema, name='add_link_sistema')
]
