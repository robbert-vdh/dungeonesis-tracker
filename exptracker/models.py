from enum import Enum

from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.core.exceptions import ValidationError
from django.db import models

from .utils import stars_to_level


class User(AbstractUser):
    """
    A replacement user model to keep track of EXP.

    Attributes
    ----------
    unspent_stars : int
        The number of stars that the player can still distribute amongst his
        or her characters.

    """

    unspent_stars = models.PositiveIntegerField(default=0)


class Character(models.Model):
    """
    A player's character.

    Attributes
    ----------
    stars : int
        The number stars allocated to this character. From this we can
        calculate the character's level and the banners used for character
        progression. This should be set accordingly when adding a character.
        For instance, a fresh level 6 character has 48 stars. Four times eight
        stars for the first four levels and 16 stars to progress from level 5
        to level 6.

    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="characters")

    name = models.CharField(max_length=255)
    stars = models.PositiveIntegerField()
    dead = models.BooleanField(default=False)

    @property
    def level(self):
        return stars_to_level(self.stars)[0]

    @property
    def banners(self):
        return stars_to_level(self.stars)[1]

    @property
    def progression(self):
        """
        The character's level, the number of banners and the number of stars
        towards the next banner.

        Returns
        -------
        level : int
            The character's current level.
        banners : int
            The number of banners towards the next level the character currently
            possesses.
        stars : int
            The number of stars towards the next banner the character currently
            possesses.

        """
        return stars_to_level(self.stars)


class LogType(Enum):
    CHARACTER_ADDED = "CHARACTER_ADDED"
    CHARACTER_DELETED = "CHARACTER_DELETED"
    STARS_ADDED = "STARS_ADDED"
    # Stars spent on a character from the pool of unspent stars.
    STARS_SPENT = "STARS_SPENT"


class LogEntry(models.Model):
    """
    A log storing all changes made by a player.

    This is mostly useful for later reference. The value column right now only
    stores integers or NULL values, but we'll store it as JSON in the database
    to make it slightly easier to work with.

    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="logs")
    character = models.ForeignKey(
        Character, blank=True, null=True, on_delete=models.SET_NULL, related_name="logs"
    )

    type = models.CharField(
        max_length=32, choices=((str(tag), tag.value) for tag in LogType)
    )
    value = JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.type in {
            LogType.STARS_SPENT,
            LogType.CHARACTER_ADDED,
            LogType.CHARACTER_DELETED,
        }:
            if self.character_id is None:
                raise ValidationError({"character": "Missing character."})

        # Verify that the type of `self.value` matches the log entry's type
        if self.type in {
            LogType.STARS_SPENT,
            LogType.STARS_ADDED,
            LogType.CHARACTER_ADDED,
            LogType.CHARACTER_DELETED,
        }:
            if type(self.value) != dict:
                raise ValidationError(
                    {"value": "Incorrect value type, expected 'dict'."}
                )
