from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    assigned_to_username = serializers.ReadOnlyField(source="assigned_to.username")

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "priority",
            "status",
            "created_by",
            "created_by_username",
            "assigned_to",
            "assigned_to_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]
