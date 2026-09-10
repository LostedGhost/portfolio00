from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.images import resize_uncommitted_field


class SingletonModel(models.Model):
    """Base for models that must have exactly one row (pk always 1)."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Profile(SingletonModel):
    full_name = models.CharField('nom complet', max_length=200)
    site_name = models.CharField(
        'nom du site / marque', max_length=100, blank=True,
        help_text="Affiche dans la barre de navigation et le pied de page. Laisser vide pour utiliser le nom complet.",
    )
    title = models.CharField('poste', max_length=200)
    email = models.EmailField('email')
    phone = models.CharField('telephone', max_length=50, blank=True)
    photo = models.ImageField('photo', upload_to='profile/', blank=True)
    logo = models.ImageField('logo', upload_to='profile/', blank=True)
    hero_image = models.ImageField(
        'image de la scene 3D', upload_to='profile/', blank=True,
        help_text="Utilisee comme texture sur l'objet 3D de l'accueil (distincte de la photo de profil).",
    )
    hero_background_image = models.ImageField(
        'image de fond de la scene 3D', upload_to='profile/', blank=True,
        help_text="Affichee derriere les etoiles, en fond de l'accueil.",
    )
    hero_background_opacity = models.PositiveSmallIntegerField(
        "opacite de l'image de fond (%)", default=30,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    cv = models.FileField('CV', upload_to='profile/', blank=True)
    description = models.TextField('description', blank=True)
    available = models.BooleanField('disponible', default=True)
    updated_at = models.DateTimeField('mis a jour le', auto_now=True)

    class Meta:
        verbose_name = 'Profil'
        verbose_name_plural = 'Profil'

    def save(self, *args, **kwargs):
        resize_uncommitted_field(self.photo, (800, 800))
        resize_uncommitted_field(self.logo, (400, 400))
        resize_uncommitted_field(self.hero_image, (1024, 1024))
        resize_uncommitted_field(self.hero_background_image, (1920, 1080))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name or 'Profil'


class OrderedModel(models.Model):
    order = models.PositiveIntegerField('ordre', default=0)

    class Meta:
        abstract = True
        ordering = ['order', 'id']


class Skill(OrderedModel):
    name = models.CharField('nom', max_length=100)
    value = models.PositiveSmallIntegerField('niveau (%)', validators=[MinValueValidator(0), MaxValueValidator(100)])

    class Meta(OrderedModel.Meta):
        verbose_name = 'Competence'
        verbose_name_plural = 'Competences'

    def __str__(self):
        return self.name


class Technology(OrderedModel):
    name = models.CharField('nom', max_length=100)
    logo = models.ImageField('logo', upload_to='technologies/')

    class Meta(OrderedModel.Meta):
        verbose_name = 'Technologie'
        verbose_name_plural = 'Technologies'

    def save(self, *args, **kwargs):
        resize_uncommitted_field(self.logo, (512, 512), background=(255, 255, 255))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Experience(OrderedModel):
    company = models.CharField('entreprise', max_length=200)
    type = models.CharField('type', max_length=100, help_text='Ex: Stage professionnel, Freelance, Benevolat')
    start_date = models.DateField('date de debut')
    end_date = models.DateField('date de fin', null=True, blank=True, help_text='Laisser vide si en cours')
    description = models.TextField('description', blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'

    def __str__(self):
        return f'{self.company} ({self.type})'


class Statistic(OrderedModel):
    label = models.CharField('libelle', max_length=100)
    value = models.IntegerField('valeur')
    suffix = models.CharField('suffixe', max_length=20, blank=True, help_text='Ex: %, +')

    class Meta(OrderedModel.Meta):
        verbose_name = 'Statistique'
        verbose_name_plural = 'Statistiques'

    def __str__(self):
        return self.label


class Project(OrderedModel):
    title = models.CharField('titre', max_length=200)
    category = models.CharField('categorie', max_length=100, blank=True)
    date = models.DateField('date')
    image = models.ImageField('image', upload_to='projects/')
    link = models.CharField('lien', max_length=500, blank=True, default='', help_text="URL du site en ligne, laisser vide ou '#' si aucun")
    description = models.TextField('description', blank=True, help_text='Presentation du projet pour la fiche detaillee')
    role = models.CharField('role', max_length=200, blank=True, help_text='Ex: Developpeur full-stack solo')
    results = models.TextField('resultats', blank=True, help_text='Defis releves / resultats obtenus')
    technologies = models.ManyToManyField(Technology, verbose_name='technologies', blank=True, related_name='projects')

    class Meta(OrderedModel.Meta):
        verbose_name = 'Projet'
        verbose_name_plural = 'Projets'

    def save(self, *args, **kwargs):
        resize_uncommitted_field(self.image, (1600, 1000))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ContactInfo(SingletonModel):
    address = models.CharField('adresse', max_length=255, blank=True)
    phone = models.CharField('telephone', max_length=50, blank=True)
    email = models.EmailField('email', blank=True)
    form_active = models.BooleanField('formulaire de contact actif', default=True)

    class Meta:
        verbose_name = 'Informations de contact'
        verbose_name_plural = 'Informations de contact'

    def __str__(self):
        return 'Informations de contact'


class SocialLink(OrderedModel):
    platform = models.CharField('plateforme', max_length=50, help_text='Ex: GitHub, LinkedIn, Twitter/X')
    url = models.URLField('URL')

    class Meta(OrderedModel.Meta):
        verbose_name = 'Reseau social'
        verbose_name_plural = 'Reseaux sociaux'

    def __str__(self):
        return self.platform


class Education(OrderedModel):
    institution = models.CharField('etablissement', max_length=200)
    degree = models.CharField('diplome', max_length=200)
    start_date = models.DateField('date de debut')
    end_date = models.DateField('date de fin', null=True, blank=True, help_text='Laisser vide si en cours')
    description = models.TextField('description', blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Formation'
        verbose_name_plural = 'Formations'

    def __str__(self):
        return f'{self.degree} - {self.institution}'


class Certification(OrderedModel):
    name = models.CharField('nom', max_length=200)
    issuer = models.CharField('organisme', max_length=200)
    date_obtained = models.DateField("date d'obtention")
    credential_url = models.URLField('lien du certificat', blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'

    def __str__(self):
        return self.name


class Testimonial(OrderedModel):
    author_name = models.CharField('nom', max_length=200)
    author_role = models.CharField('fonction', max_length=200, blank=True, help_text='Ex: CEO chez Startup Boost')
    content = models.TextField('temoignage')
    photo = models.ImageField('photo', upload_to='testimonials/', blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Temoignage'
        verbose_name_plural = 'Temoignages'

    def save(self, *args, **kwargs):
        resize_uncommitted_field(self.photo, (400, 400))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.author_name
