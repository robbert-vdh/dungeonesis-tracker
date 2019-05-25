from django.db import transaction
from django.db.models import F
from rest_framework import permissions, serializers, viewsets
from rest_framework.exceptions import APIException
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .models import Character, LogType


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


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def adjust_stars(request):
    serializer = StarRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    stars = serializer.validated_data["stars"]
    with transaction.atomic():
        if request.user.unspent_stars + stars < 0:
            raise APIException(
                "You can't have a negative number of stars. That would be silly."
            )

        request.user.unspent_stars = F("unspent_stars") + stars
        request.user.save()

        # To make the log actually useful we will also optionally log the cause
        # of this star increase. This value is freeform and can be null.
        request.user.logs.create(
            type=LogType.STARS_ADDED,
            value={"amount": stars, "reason": serializer.validated_data.get("reason")},
            character=None,
        )

    return Response({"added_stars": stars})


class CharacterViewSet(viewsets.ModelViewSet):
    """
    The viewset for modifying characters.

    There are very few restrictions here since there is not really a reason to.
    It's important to note that there are two ways to add stars to a character
    and they both have a different purpose:

    - `POST /api/characters/<id>/spend` allows you to move stars from the pool
      of unallocated stars to a character.
    - `PUT or PATCH /api/characters/<id>` can be used to update a character's
      number of stars in place. This is useful when clamining star rewards that
      can only be spent on a certain character.

    """

    serializer_class = CharacterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.characters.all()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        request.user.logs.create(
            type=LogType.CHARACTER_ADDED,
            value=response.data,
            character_id=response.data["id"],
        )

        return response

    def destroy(self, request, *args, **kwargs):
        character_data = CharacterSerializer(self.get_object()).data
        response = super().destroy(request, *args, **kwargs)

        request.user.logs.create(
            type=LogType.CHARACTER_DELETED, value=character_data, character_id=None
        )

        return response

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        character = self.get_object()
        old_stars = character.stars
        response = super().update(request, *args, **kwargs)
        new_stars = response.data["stars"]

        # As explained above we'll simply log when a character's number of
        # stars changes
        if old_stars != new_stars:
            request.user.logs.create(
                type=LogType.STARS_SPENT,
                value=new_stars - old_stars,
                character=character,
            )

        return response

    @action(detail=True, methods=["post"], name="Spend stars from pool")
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
