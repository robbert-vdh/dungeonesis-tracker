from rest_framework import viewsets, permissions, serializers

from .models import Character


class CharacterSelializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ("id", "name", "stars")


class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSelializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.characters.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
