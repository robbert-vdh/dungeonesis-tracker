from rest_framework import viewsets, permissions, serializers

from .models import Character

# TODO: An API for adding and spending stars to and from the star pool


class CharacterSelializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ("id", "name", "stars")

        # Stars should only be modified using transacitonal methods so that we
        # can keep a log
        read_only_fields = ("id", "stars")


class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSelializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.characters.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
