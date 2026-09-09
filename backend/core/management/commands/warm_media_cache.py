from django.core.management.base import BaseCommand

from core.media_cache import get_file
from portfolio.models import Profile, Project, Technology


class Command(BaseCommand):
    help = "Pre-fetches every stored media file through LuluFiles once so the local cache is warm before real visitors arrive (each cold fetch takes several seconds)."

    def handle(self, *args, **options):
        file_ids = []
        profile = Profile.load()
        for field_name in ('photo', 'logo', 'cv'):
            file = getattr(profile, field_name)
            if file:
                file_ids.append(file.name)
        file_ids += [t.logo.name for t in Technology.objects.all() if t.logo]
        file_ids += [p.image.name for p in Project.objects.all() if p.image]

        self.stdout.write(f'Rechauffement du cache pour {len(file_ids)} fichiers...')
        for file_id in file_ids:
            result = get_file(file_id)
            status = 'ok' if result else 'ECHEC'
            self.stdout.write(f'  {file_id}: {status}')
        self.stdout.write(self.style.SUCCESS('Termine.'))
