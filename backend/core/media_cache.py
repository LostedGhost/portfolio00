import requests
from django.conf import settings
from django.core.cache import cache

CACHE_KEY_PREFIX = 'lulufiles_media'
# 30 days: a save() always gets a brand-new LuluFiles id (see LuluFilesStorage),
# the old one is deleted, so cached bytes for a given id never go stale.
CACHE_TIMEOUT = 60 * 60 * 24 * 30


def get_file(file_id):
    """Return (content_bytes, content_type) for a LuluFiles file id, using the
    local cache to avoid re-fetching through LuluFiles/Telegram on every
    request (that round trip alone takes several seconds)."""
    key = f'{CACHE_KEY_PREFIX}:{file_id}'
    cached = cache.get(key)
    if cached is not None:
        return cached

    response = requests.get(
        f'{settings.LULUFILES_BASE_URL}/files/{file_id}/preview',
        headers={'X-API-Key': settings.LULUFILES_API_KEY},
        timeout=20,
    )
    if response.status_code != 200:
        return None

    result = (response.content, response.headers.get('Content-Type', 'application/octet-stream'))
    cache.set(key, result, CACHE_TIMEOUT)
    return result
