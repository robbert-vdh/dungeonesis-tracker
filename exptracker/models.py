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


class Character(models.Model):
    """
    A player's character.

    Attributes
    ----------
    points : int
        The number points allocated to this character. From this we can
        calculate the character's level and the banners used for character
        progression. This should be set accordingly when adding a character.
        For instance, a fresh level 6 character has 48 points. Four times eight
        points for the first four levels and 16 points to progress from level 5
        to level 6.

    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="characters")

    name = models.CharField(max_length=255)
    points = models.PositiveIntegerField()

    # TODO: Attributes to retrieve a character's level and banner progression
