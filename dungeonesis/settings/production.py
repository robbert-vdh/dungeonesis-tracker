from .base import *


DEBUG = False

STATICFILES_STORAGE = "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"

# Don't forget to set these in local.py
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = None
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = None

# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/ for an
# overview of settings to set in local.py


try:
    from .local import *
except ImportError:
    pass
