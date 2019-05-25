from django.urls import path
from rest_framework import routers

from . import api

router = routers.SimpleRouter()
router.register("characters", api.characters.CharacterViewSet, "characters")

urlpatterns = router.urls + [
    path("user/", api.user.UserInfo.as_view()),
    path("user/adjust/", api.user.adjust_stars),
]
