from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from notifications.models import Notification

User = get_user_model()


@receiver(post_save, sender=User)
def notify_admin_on_user_creation(sender, instance, created, **kwargs):
    if created:
        admins = User.objects.filter(is_superuser=True)
        for admin in admins:
            Notification.objects.create(
                user=admin,
                message=f"New user registered: {instance.username}",
            )
