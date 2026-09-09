from django.urls import path

from .views import media_proxy

urlpatterns = [
    path('<str:file_id>/', media_proxy, name='media-proxy'),
]
