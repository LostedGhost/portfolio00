"""
Django settings for config project.
"""

from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)
environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'adminsortable2',
    'core',
    'portfolio',
    'contact',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
LOGIN_REDIRECT_URL = '/admin/'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASE_URL = env('DATABASE_URL', default='') or f'sqlite:///{BASE_DIR / "db.sqlite3"}'
DATABASES = {
    'default': env.db_url_config(DATABASE_URL)
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Porto-Novo'
USE_I18N = True
USE_TZ = True

# Static files (admin CSS/JS) — served via whitenoise
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'default': {
        'BACKEND': 'core.storage.LuluFilesStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Cache for proxied LuluFiles media bytes (see core/media_cache.py) — avoids a
# multi-second LuluFiles/Telegram round trip on every image request.
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': str(BASE_DIR / 'media_cache'),
    }
}

# ---- LuluFiles (media storage) ----
LULUFILES_BASE_URL = env('LULUFILES_BASE_URL', default='https://lulufiles.graciotopanou.online')
LULUFILES_API_KEY = env('LULUFILES_API_KEY', default='')
LULUFILES_APP_ID = env('LULUFILES_APP_ID', default='')

# ---- CORS ----
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[])
CORS_ALLOW_CREDENTIALS = False

CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=[])

# ---- DRF ----
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle'],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '1000/day',
        'contact': '5/day',
    },
    'DEFAULT_RENDERER_CLASSES': (
        ['rest_framework.renderers.JSONRenderer']
        if not DEBUG
        else ['rest_framework.renderers.JSONRenderer', 'rest_framework.renderers.BrowsableAPIRenderer']
    ),
}

# ---- Admin look & feel (django-jazzmin) ----
JAZZMIN_SETTINGS = {
    'site_title': 'Portfolio Admin',
    'site_header': 'Portfolio',
    'site_brand': 'Portfolio Admin',
    'welcome_sign': 'Gestion du contenu du portfolio',
    'copyright': 'Ludel TOPANOU',
    'search_model': ['portfolio.Project', 'contact.Message'],
    'show_sidebar': True,
    'navigation_expanded': True,
    'related_modal_active': True,
    'order_with_respect_to': [
        'portfolio.Profile',
        'portfolio.ContactInfo',
        'portfolio.SocialLink',
        'portfolio.Skill',
        'portfolio.Technology',
        'portfolio.Experience',
        'portfolio.Education',
        'portfolio.Certification',
        'portfolio.Project',
        'portfolio.Statistic',
        'portfolio.Testimonial',
        'contact.Message',
        'auth',
    ],
    'icons': {
        'auth': 'fas fa-users-cog',
        'auth.user': 'fas fa-user',
        'auth.Group': 'fas fa-users',
        'portfolio.Profile': 'fas fa-id-badge',
        'portfolio.ContactInfo': 'fas fa-address-card',
        'portfolio.SocialLink': 'fas fa-share-alt',
        'portfolio.Skill': 'fas fa-chart-bar',
        'portfolio.Technology': 'fas fa-laptop-code',
        'portfolio.Experience': 'fas fa-briefcase',
        'portfolio.Education': 'fas fa-graduation-cap',
        'portfolio.Certification': 'fas fa-certificate',
        'portfolio.Project': 'fas fa-folder-open',
        'portfolio.Statistic': 'fas fa-chart-line',
        'portfolio.Testimonial': 'fas fa-quote-right',
        'contact.Message': 'fas fa-envelope',
    },
    'default_icon_parents': 'fas fa-chevron-circle-right',
    'default_icon_children': 'fas fa-circle',
    'show_ui_builder': False,
    'custom_css': 'admin/custom_jazzmin.css',
}

JAZZMIN_UI_TWEAKS = {
    'navbar_small_text': False,
    'footer_small_text': False,
    'body_small_text': False,
    'brand_small_text': False,
    'brand_colour': 'navbar-dark',
    'accent': 'accent-info',
    'navbar': 'navbar-dark',
    'no_navbar_border': True,
    'navbar_fixed': True,
    'layout_boxed': False,
    'footer_fixed': False,
    'sidebar_fixed': True,
    'sidebar': 'sidebar-dark-primary',
    'sidebar_nav_small_text': False,
    'sidebar_disable_expand': False,
    'sidebar_nav_child_indent': True,
    'sidebar_nav_compact_style': False,
    'sidebar_nav_legacy_style': False,
    'sidebar_nav_flat_style': True,
    'theme': 'darkly',
    'dark_mode_theme': 'darkly',
    'button_classes': {
        'primary': 'btn-outline-info',
        'secondary': 'btn-outline-secondary',
        'info': 'btn-outline-info',
        'warning': 'btn-outline-warning',
        'danger': 'btn-outline-danger',
        'success': 'btn-outline-success',
    },
}

# ---- Prod hardening ----
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
