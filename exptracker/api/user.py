from django.db import transaction
from django.db.models import F
from rest_framework import generics, permissions
from rest_framework.exceptions import APIException
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .serializers import LogSerializer, StarRequestSerializer, UserInfoSerializer

from ..models import LogType


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


class UserLogs(generics.ListAPIView):
    """
    An API view for listing all log entries associated with the currently
    logged in user.

    """

    serializer_class = LogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.logs.order_by("-created_at")


class UserInfo(generics.RetrieveAPIView):
    """
    An API view for retrieving basic player information.

    This will return:

    - The user's name
    - How many unspent stars the user has

    """

    serializer_class = UserInfoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
