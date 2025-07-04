from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "priority",
        "status",
        "assigned_to",
        "due_date",
        "created_by",
        "created_at",
    )
    list_filter = ("priority", "status", "due_date")
    search_fields = ("title", "description")
    autocomplete_fields = ["created_by", "assigned_to"]
    ordering = ("-created_at",)
