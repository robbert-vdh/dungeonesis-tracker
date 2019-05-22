from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    A replacement user model to keep track of EXP.

    Attributes
    ----------
    unspent_points : int
        The number of points that the player can still distribute amongst his
        or her characters.

    """

    unspent_points = models.PositiveIntegerField(default=0)

