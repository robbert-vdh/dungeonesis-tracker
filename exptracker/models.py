from enum import Enum

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    A replacement user model to keep track of EXP.

    Attributes
    ----------
    unspent_points : int
        The number of stars that the player can still distribute amongst his
        or her characters.

    """

    unspent_points = models.PositiveIntegerField(default=0)


class Character(models.Model):
    """
    A player's character.

    Attributes
    ----------
    points : int
        The number stars allocated to this character. From this we can
        calculate the character's level and the banners used for character
        progression. This should be set accordingly when adding a character.
        For instance, a fresh level 6 character has 48 stars. Four times eight
        stars for the first four levels and 16 stars to progress from level 5
        to level 6.

    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="characters")

    name = models.CharField(max_length=255)
    points = models.PositiveIntegerField()

    # TODO: Attributes to retrieve a character's level and banner progression


class LogType(Enum):
    CHARACTER_ADDED = "CHARACTER_ADDED"
    CHARACTER_DELETED = "CHARACTER_DELETED"
    # The value for this event can be negative when stars are explicitely
    # removed instead of being spent on a character, i.e. after having added
    # too many or when stars are used to buy inspiration.
    POINTS_MODIFIED = "POINTS_MODIFIED"
    # Points spent on a character.
    POINTS_SPENT = "POINTS_SPENT"


class LogEntry(models.Model):
    """
    A log storing all changes made by a player.

    This is mostly useful for reference.

    """

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="logs")
    character = models.ForeignKey(
        User, null=True, on_delete=models.DO_NOTHING, related_name="logs"
    )

    # TODO: Type
    # TODO: Value
