import asyncio

import pytest
from channels.testing import WebsocketCommunicator

from core.asgi import application


@pytest.mark.asyncio
async def test_websocket_connection_and_broadcast():
    communicator = WebsocketCommunicator(application, "/ws/tasks/")
    connected, _ = await communicator.connect()
    assert connected is True

    from channels.layers import get_channel_layer

    channel_layer = get_channel_layer()

    event_data = {
        "type": "task_created",
        "id": 123,
        "title": "Test WebSocket Task",
        "description": "Created via test",
        "status": "pending",
        "priority": "high",
    }

    await channel_layer.group_send("tasks", event_data)

    response = await communicator.receive_json_from()
    assert response["type"] == "task_created"
    assert response["title"] == "Test WebSocket Task"

    await communicator.disconnect()
