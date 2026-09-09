from django.db import connection
from django.http import HttpResponse, JsonResponse

from .media_cache import get_file


def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
    except Exception as exc:
        return JsonResponse({'status': 'error', 'detail': str(exc)}, status=503)
    return JsonResponse({'status': 'ok'})


def media_proxy(request, file_id):
    """Relay a file's bytes from LuluFiles (via the shared cache), injecting
    the API key server-side.

    LuluFiles' preview/download endpoints require X-API-Key, so the public
    React frontend cannot load images directly from LuluFiles without leaking
    the key to the browser. This view is what `LuluFilesStorage.url()` points
    to instead.
    """
    result = get_file(file_id)
    if result is None:
        return HttpResponse(status=404)

    content, content_type = result
    response = HttpResponse(content, content_type=content_type)
    response['Cache-Control'] = 'public, max-age=86400'
    response['Access-Control-Allow-Origin'] = '*'
    return response
