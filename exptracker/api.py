from django.db import transaction
from django.db.models import F
from rest_framework import permissions, serializers, viewsets
from rest_framework.exceptions import APIException
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Character, LogType

# TODO: An API for adding and spending stars to and from the star pool


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ("id", "name", "stars")

        # Stars should only be modified using transacitonal methods so that we
        # can keep a log
        read_only_fields = ("id", "stars")


class StarRequestSerializer(serializers.Serializer):
    """
    A serializer that only stores a single integer, used for spending and
    modifying a player's stars.

    """

    stars = serializers.IntegerField()


class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.characters.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"], name="Allocate stars from pool")
    def spend(self, request, pk):
        """Spend stars from the pool on this character."""

        serializer = StarRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stars = serializer.validated_data["stars"]
        if stars <= 0:
            raise APIException(
                "The number of stars spent must be positive and non-zero."
            )

        character = self.get_object()
        with transaction.atomic():
            if stars > request.user.unspent_stars:
                raise APIException("You do not have enough stars.")

            character.stars = F("stars") + stars
            request.user.unspent_stars = F("unspent_stars") - stars

            character.save()
            request.user.save()

            request.user.logs.create(
                type=LogType.STARS_SPENT, value=stars, character=character
            )

        return Response({"spent_stars": stars})
