from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image


def resize_image(file_path, max_size, output_name, background=None):
    """Downscale an image to fit within max_size (keeps aspect ratio, never
    upscales) and return a Django ContentFile ready to assign to a FileField.

    Legacy uploads were stored at whatever resolution the user dropped in
    (some tech logos were 2000x2000px for a ~40px on-screen icon) — shipping
    that as-is as a WebGL texture is enough to exhaust GPU memory and crash
    the render context once a few dozen are loaded at once.

    `background`, when given (e.g. (255, 255, 255)), flattens transparency
    onto that solid color instead of keeping alpha: a WebGL texture without
    `transparent: true` on its material renders transparent pixels as black,
    which turns a logo like GitHub's (mostly-transparent PNG) into a near
    solid black square on a cube face.
    """
    with Image.open(file_path) as img:
        img = img.convert('RGBA') if img.mode in ('P', 'RGBA', 'LA') else img.convert('RGB')
        img.thumbnail(max_size, Image.LANCZOS)
        if background is not None and img.mode == 'RGBA':
            flattened = Image.new('RGB', img.size, background)
            flattened.paste(img, mask=img.getchannel('A'))
            img = flattened
        buffer = BytesIO()
        img.save(buffer, format='PNG', optimize=True)
        return ContentFile(buffer.getvalue(), name=output_name)


def resize_uncommitted_field(field, max_size, background=None):
    """Downscale a Django FieldFile in place, but only if it holds a file that
    hasn't been uploaded to storage yet (a fresh admin upload). Already-stored
    fields are left untouched — re-processing them would mean re-downloading
    from LuluFiles just to re-upload, for no benefit.

    Without this, an image dropped straight into the admin (as opposed to the
    one-off import_legacy_data command, which already resizes) bypasses the
    size cap entirely — for a Technology.logo that's the same oversized-WebGL-
    texture crash the import resizing was added to fix, just re-opened by the
    next edit made through the admin instead of the initial import.
    """
    if not field or field._committed:
        return
    field.file = resize_image(field.file, max_size, field.name, background=background)
