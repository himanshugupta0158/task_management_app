from django.conf import settings
from django.db import models


class Task(models.Model):
    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("on_hold", "On Hold"),
        ("completed", "Completed"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="created_tasks", on_delete=models.CASCADE
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="assigned_tasks",
        on_delete=models.CASCADE,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
