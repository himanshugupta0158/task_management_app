from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    task_title = serializers.ReadOnlyField(source="task.title")

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "message",
            "task",
            "task_title",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["user", "created_at"]
