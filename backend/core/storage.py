import logging
import mimetypes
import time

import requests
from django.conf import settings
from django.core.files.storage import Storage

logger = logging.getLogger(__name__)

READY_STATUSES = {'ready', 'completed', 'done', 'available'}
FAILED_STATUSES = {'failed', 'error'}
POLL_INTERVAL_SECONDS = 2
POLL_TIMEOUT_SECONDS = 15


class LuluFilesStorage(Storage):
    """Django storage backend backed by the LuluFiles API (file hosting over Telegram).

    Files are addressed by the id LuluFiles assigns on upload (the "name" Django
    is given is discarded), so `.url()` can be built from that id alone with no
    extra network round trip, mirroring how S3-style backends work.
    """

    def _headers(self):
        return {'X-API-Key': settings.LULUFILES_API_KEY}

    def _save(self, name, content):
        content.seek(0)
        content_type = getattr(content, 'content_type', None) or mimetypes.guess_type(name)[0] or 'application/octet-stream'
        data = {'app_id': settings.LULUFILES_APP_ID} if settings.LULUFILES_APP_ID else {}
        response = requests.post(
            f'{settings.LULUFILES_BASE_URL}/files/upload',
            headers=self._headers(),
            data=data,
            files={'upload': (name, content, content_type)},
            timeout=30,
        )
        response.raise_for_status()
        file_id = response.json()['id']
        self._wait_until_ready(file_id)
        return file_id

    def _wait_until_ready(self, file_id):
        deadline = time.monotonic() + POLL_TIMEOUT_SECONDS
        status = 'queued'
        while time.monotonic() < deadline:
            try:
                resp = requests.get(
                    f'{settings.LULUFILES_BASE_URL}/files/{file_id}',
                    headers=self._headers(),
                    timeout=10,
                )
                resp.raise_for_status()
                status = resp.json().get('status', status)
            except requests.RequestException as exc:
                logger.warning('LuluFiles: erreur lors du polling de %s: %s', file_id, exc)
                break
            if status in READY_STATUSES:
                return
            if status in FAILED_STATUSES:
                logger.warning('LuluFiles: upload %s en echec (status=%s)', file_id, status)
                return
            time.sleep(POLL_INTERVAL_SECONDS)
        logger.warning('LuluFiles: fichier %s pas encore pret apres %ss (dernier status=%s)', file_id, POLL_TIMEOUT_SECONDS, status)

    def _open(self, name, mode='rb'):
        raise NotImplementedError('LuluFilesStorage is write-through only; files are never read back by the app.')

    def exists(self, name):
        return False

    def delete(self, name):
        try:
            requests.delete(
                f'{settings.LULUFILES_BASE_URL}/files/{name}',
                headers=self._headers(),
                timeout=10,
            ).raise_for_status()
        except requests.RequestException as exc:
            logger.warning('LuluFiles: echec de suppression de %s: %s', name, exc)

    def url(self, name):
        # Relative on purpose: LuluFiles' preview/download endpoints require
        # X-API-Key, so the browser can't hit them directly without leaking
        # the key. This points at our own /media/<id>/ proxy instead (DRF's
        # FileField turns this into an absolute URL using the request
        # context automatically).
        return f'/media/{name}/'

    def size(self, name):
        try:
            resp = requests.get(
                f'{settings.LULUFILES_BASE_URL}/files/{name}',
                headers=self._headers(),
                timeout=10,
            )
            resp.raise_for_status()
            return resp.json().get('size_bytes', 0)
        except requests.RequestException:
            return 0
