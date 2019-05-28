from .base import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "j%8-3s^_r7va1w8x1d_u=+f&tfgx($8@6_&m9!qqlsl@b+c&ty"

# Don't forget to set these in local.py
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = None
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = None


try:
    from .local import *
except ImportError:
    pass
