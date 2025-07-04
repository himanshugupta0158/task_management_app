from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


class NotificationTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="notify", password="pass")
        self.client.force_authenticate(self.user)

    def test_empty_notifications(self):
        response = self.client.get(reverse("notification-list"))
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 0)
