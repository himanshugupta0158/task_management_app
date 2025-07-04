from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class UserAPITestCase(APITestCase):
    def setUp(self):
        self.register_url = reverse("user-register")
        self.login_url = reverse("token_obtain_pair")
        self.refresh_url = reverse("token_refresh")
        self.verify_url = reverse("token_verify")
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass"
        )

    def test_register(self):
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass123",
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login(self):
        data = {"username": "testuser", "password": "testpass"}
        response = self.client.post(self.login_url, data)
        self.assertIn("access", response.data)

    def test_refresh(self):
        login_response = self.client.post(
            self.login_url, {"username": "testuser", "password": "testpass"}
        )
        refresh_token = login_response.data["refresh"]
        response = self.client.post(self.refresh_url, {"refresh": refresh_token})
        self.assertIn("access", response.data)

    def test_verify(self):
        login_response = self.client.post(
            self.login_url, {"username": "testuser", "password": "testpass"}
        )
        access_token = login_response.data["access"]
        response = self.client.post(self.verify_url, {"token": access_token})
        self.assertEqual(response.status_code, 200)
