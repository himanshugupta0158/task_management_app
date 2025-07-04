from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import LogoutView, RegisterView, UserListView, UserUpdateView

urlpatterns = [
    path("", UserListView.as_view(), name="user-list"),
    path("me/", UserUpdateView.as_view(), name="user-update"),
    path("register/", RegisterView.as_view(), name="user-register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/logout/", LogoutView.as_view(), name="token_logout"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
