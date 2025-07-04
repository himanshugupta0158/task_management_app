from django.contrib.auth import get_user_model
from django.test import TestCase

from notifications.models import Notification
from notifications.tasks import send_notification
from tasks.models import Task

User = get_user_model()


class NotificationTaskTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="celery", password="pass")
        self.task = Task.objects.create(
            title="T",
            description="...",
            priority="low",
            due_date="2025-07-10",
            assigned_to=self.user,
            created_by=self.user,
        )

    def test_send_notification(self):
        send_notification(self.user.id, self.task.id, "Test Message")
        self.assertTrue(Notification.objects.filter(user=self.user).exists())
