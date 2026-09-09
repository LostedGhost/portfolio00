import json
import re
from datetime import date
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand, CommandError

from contact.models import Message as _Message  # noqa: F401 (documents that messages are intentionally skipped)
from core.images import resize_image
from portfolio.models import ContactInfo, Experience, Profile, Project, Skill, Statistic, Technology


def parse_date(value):
    return date.fromisoformat(value) if value else None


class Command(BaseCommand):
    help = 'Importe le contenu de l\'ancien data.json (et les fichiers de public/uploads/) dans les modeles Django. A executer localement uniquement.'

    def add_arguments(self, parser):
        parser.add_argument('--file', default=None, help='Chemin vers l\'ancien data.json (defaut: ../legacy/data.json)')
        parser.add_argument('--uploads-dir', default=None, help='Chemin vers l\'ancien public/uploads/ (defaut: ../legacy/public/uploads)')
        parser.add_argument('--clear', action='store_true', help='Supprime les listes existantes (Skill/Technology/Experience/Statistic/Project) avant import')

    def handle(self, *args, **options):
        backend_dir = Path(__file__).resolve().parents[3]
        data_path = Path(options['file'] or backend_dir.parent / 'legacy' / 'data.json')
        uploads_dir = Path(options['uploads_dir'] or backend_dir.parent / 'legacy' / 'public' / 'uploads')

        if not data_path.exists():
            raise CommandError(f'Fichier introuvable: {data_path}')
        if not uploads_dir.exists():
            raise CommandError(f'Dossier uploads introuvable: {uploads_dir}')

        data = json.loads(data_path.read_text(encoding='utf-8'))
        # La cle "auth" (ancien hash de mot de passe) n'a aucun equivalent dans
        # le nouveau schema : l'authentification est enterement redessinee.

        if options['clear']:
            self.stdout.write('Suppression des listes existantes...')
            for model in (Skill, Technology, Experience, Statistic, Project):
                for obj in model.objects.all():
                    for field in obj._meta.fields:
                        if field.name in ('image', 'logo') and getattr(obj, field.name):
                            getattr(obj, field.name).delete(save=False)
                model.objects.all().delete()

        self._import_profile(data.get('profil', {}), uploads_dir)
        self._import_contact_info(data.get('contact', {}))
        self._import_skills(data.get('competences', []))
        self._import_technologies(data.get('technologies', []), uploads_dir)
        self._import_experiences(data.get('experiences', []))
        self._import_statistics(data.get('statistiques', []))
        self._import_projects(data.get('projets', []), uploads_dir)

        self.stdout.write(self.style.SUCCESS('Import termine.'))

    def _attach_upload(self, instance, field_name, rel_path, uploads_dir, max_size=None, background=None):
        """rel_path is like '/uploads/1774..._name.ext'; resolve it against the
        legacy uploads dir and upload it through the configured storage
        (LuluFiles) by assigning it to the model's file field.

        max_size, when given, downscales the image first: legacy uploads were
        stored at whatever resolution was dropped in (some tech logos were
        2000x2000px for a ~40px icon), which is enough to exhaust GPU memory
        once used as WebGL textures."""
        if not rel_path:
            return
        filename = Path(rel_path).name
        local_path = uploads_dir / filename
        if not local_path.exists():
            self.stdout.write(self.style.WARNING(f'  fichier introuvable, ignore: {local_path}'))
            return
        clean_name = re.sub(r'^\d+_', '', filename)
        if max_size:
            content = resize_image(local_path, max_size, clean_name, background=background)
            getattr(instance, field_name).save(clean_name, content, save=False)
        else:
            with open(local_path, 'rb') as f:
                getattr(instance, field_name).save(clean_name, File(f), save=False)

    def _import_profile(self, profil, uploads_dir):
        self.stdout.write('Import du profil...')
        profile = Profile.load()
        profile.full_name = profil.get('nom', '')
        profile.title = profil.get('poste', '')
        profile.email = profil.get('email', '')
        profile.phone = profil.get('telephone', '')
        profile.description = profil.get('description', '')
        profile.available = profil.get('disponible', True)
        self._attach_upload(profile, 'photo', profil.get('photo'), uploads_dir, max_size=(800, 800))
        self._attach_upload(profile, 'logo', profil.get('logo'), uploads_dir, max_size=(400, 400))
        self._attach_upload(profile, 'cv', profil.get('cv'), uploads_dir)
        profile.save()

    def _import_contact_info(self, contact):
        self.stdout.write('Import des infos de contact...')
        info = ContactInfo.load()
        info.address = contact.get('adresse', '')
        info.phone = contact.get('telephone', '')
        info.email = contact.get('email', '')
        info.form_active = contact.get('formulaireActif', True)
        info.save()

    def _import_skills(self, competences):
        self.stdout.write(f'Import de {len(competences)} competences...')
        Skill.objects.bulk_create([
            Skill(name=c['nom'], value=c['valeur'], order=i)
            for i, c in enumerate(competences)
        ])

    def _import_technologies(self, technologies, uploads_dir):
        self.stdout.write(f'Import de {len(technologies)} technologies...')
        for i, t in enumerate(technologies):
            tech = Technology(name=t['nom'], order=i)
            self._attach_upload(tech, 'logo', t.get('logo'), uploads_dir, max_size=(512, 512), background=(255, 255, 255))
            tech.save()

    def _import_experiences(self, experiences):
        self.stdout.write(f'Import de {len(experiences)} experiences...')
        Experience.objects.bulk_create([
            Experience(
                company=e['entreprise'],
                type=e['type'],
                start_date=parse_date(e['dateDebut']),
                end_date=parse_date(e.get('dateFin')),
                description=e.get('description', ''),
                order=i,
            )
            for i, e in enumerate(experiences)
        ])

    def _import_statistics(self, statistiques):
        self.stdout.write(f'Import de {len(statistiques)} statistiques...')
        Statistic.objects.bulk_create([
            Statistic(label=s['libelle'], value=s['valeur'], suffix=s.get('suffixe', ''), order=i)
            for i, s in enumerate(statistiques)
        ])

    def _import_projects(self, projets, uploads_dir):
        self.stdout.write(f'Import de {len(projets)} projets...')
        for i, p in enumerate(projets):
            project = Project(
                title=p['titre'],
                category=p.get('categorie', ''),
                date=parse_date(p['date']),
                link=p.get('lien') or '',
                order=i,
            )
            self._attach_upload(project, 'image', p.get('image'), uploads_dir, max_size=(1600, 1000))
            project.save()
