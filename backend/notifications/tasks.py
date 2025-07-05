from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Notification


@shared_task
def send_notification(user_id, task_id, message):
    notification = Notification.objects.create(
        user_id=user_id, task_id=task_id, message=message
    )
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{user_id}",
        {
            "type": "notify.user",
            "message": message,
            "notification_id": notification.id,
        },
    )
