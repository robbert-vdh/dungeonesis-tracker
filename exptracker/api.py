from rest_framework import viewsets, permissions, serializers

from .models import Character
from .permissions import IsOwner


class CharacterSelializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ("name", "stars")


class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSelializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.characters.all()
