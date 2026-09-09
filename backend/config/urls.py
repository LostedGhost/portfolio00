from django.contrib import admin
from django.urls import include, path

from core.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health', health_check, name='health-check'),
    path('api/', include('portfolio.urls')),
    path('api/', include('contact.urls')),
    path('media/', include('core.urls')),
]
