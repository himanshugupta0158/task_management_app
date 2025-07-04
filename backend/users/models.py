from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

    @property
    def role(self):
        if self.is_superuser:
            return "super_admin"
        elif self.is_staff:
            return "admin"
        else:
            return "regular"
