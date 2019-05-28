from .base import *


DEBUG = False

# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/ for an
# overview of settings to set in local.py


try:
    from .local import *
except ImportError:
    pass
