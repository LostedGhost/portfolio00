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
