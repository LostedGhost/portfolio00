from django.http import HttpResponse

from .media_cache import get_file


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
