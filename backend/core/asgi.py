import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

from tasks.routing import websocket_urlpatterns as task_ws
from users.routing import websocket_urlpatterns as user_ws
from notifications.routing import websocket_urlpatterns as notification_ws


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(task_ws + user_ws + notification_ws)
        ),
    }
)
