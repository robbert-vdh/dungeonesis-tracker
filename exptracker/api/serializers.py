from rest_framework import serializers

from ..models import Character


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ("id", "name", "stars")


class StarRequestSerializer(serializers.Serializer):
    """
    A serializer that only stores a single integer, used for spending and
    modifying a player's stars.

    """

    stars = serializers.IntegerField()
    reason = serializers.CharField(required=False)
