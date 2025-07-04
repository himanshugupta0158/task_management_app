from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


class TaskAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="u1", password="pass")
        self.client.force_authenticate(self.user)
        self.create_url = reverse("task-list-create")

    def test_create_task(self):
        data = {
            "title": "Test Task",
            "description": "Do it",
            "priority": "high",
            "status": "pending",
            "due_date": "2025-07-10",
            "assigned_to": self.user.id,
        }
        response = self.client.post(self.create_url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "Test Task")
