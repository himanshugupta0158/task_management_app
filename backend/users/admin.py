from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
    )
    list_filter = ("is_active", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    ordering = ("id",)

    def role(self, obj):
        if obj.is_superuser:
            return "super_admin"
        elif obj.is_staff:
            return "admin"
        return "regular"
