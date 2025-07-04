from django.core.cache import cache
from rest_framework import generics, permissions

from .models import Notification
from .serializers import NotificationSerializer
from .tasks import send_notification


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by(
            "-created_at"
        )

    def perform_create(self, serializer):
        task = serializer.save(created_by=self.request.user)
        send_notification.delay(
            task.assigned_to.id,
            task.id,
            f"You've been assigned a new task: {task.title}",
        )
        cache.clear()
