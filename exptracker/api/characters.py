from django.db import transaction
from django.db.models import F
from rest_framework import permissions, viewsets
from rest_framework.exceptions import APIException
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import CharacterSerializer, StarRequestSerializer

from ..models import LogType


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

    # TODO: It might be useful to have a method here to 'buy' a high level
    #       character with points, but I'm not sure if that has any added value
    #       except for preventing data races
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
                value={
                    "amount": new_stars - old_stars,
                    "reason": response.data.get("reason", None),
                },
                character=character,
            )

        return response

    @action(detail=True, methods=["post"], name="Spend stars from pool")
    def spend(self, request, pk):
        """
        Spend stars from the pool on this character. A negative amount of stars
        will result in stars getting refunded back to the pool.

        """

        serializer = StarRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stars = serializer.validated_data["stars"]
        if stars == 0:
            raise APIException("The number of stars spent must non-zero.")

        character = self.get_object()
        with transaction.atomic():
            if stars > request.user.unspent_stars:
                raise APIException("You do not have enough stars to buy this banner.")
            if character.stars + stars < 0:
                raise APIException(
                    "Your character can't have a negative number of stars."
                )

            character.stars = F("stars") + stars
            request.user.unspent_stars = F("unspent_stars") - stars

            character.save()
            request.user.save()

            request.user.logs.create(
                type=LogType.STARS_SPENT, value=stars, character=character
            )

        return Response({"spent_stars": stars})
