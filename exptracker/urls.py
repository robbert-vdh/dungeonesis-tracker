from django.urls import path
from rest_framework import routers

from . import api

router = routers.SimpleRouter()
router.register("characters", api.CharacterViewSet, "character")

urlpatterns = router.urls + [path("user/adjust", api.adjust_stars)]
