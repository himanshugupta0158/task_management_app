from celery import shared_task

from .models import Notification


@shared_task
def send_notification(user_id, task_id, message):
    Notification.objects.create(user_id=user_id, task_id=task_id, message=message)
