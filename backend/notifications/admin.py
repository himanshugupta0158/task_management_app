from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "message", "task", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("message",)
    autocomplete_fields = ["user", "task"]
    ordering = ("-created_at",)
