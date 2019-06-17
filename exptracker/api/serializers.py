from rest_framework import serializers

from ..models import LogEntry, Character, User


class CharacterSerializer(serializers.ModelSerializer):
    # An optional reason for the change, used when updating characters
    reason = serializers.CharField(required=False)

    class Meta:
        model = Character
        fields = ("id", "name", "stars", "dead", "reason")


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = ("character", "type", "value", "created_at")


class StarRequestSerializer(serializers.Serializer):
    """
    A serializer that only stores a single integer, used for spending and
    modifying a player's stars.

    """

    stars = serializers.IntegerField()
    reason = serializers.CharField(allow_null=True, required=False)


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "unspent_stars")
