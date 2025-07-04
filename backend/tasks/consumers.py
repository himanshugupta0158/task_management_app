from channels.generic.websocket import AsyncJsonWebsocketConsumer


class TaskConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.group_name = "tasks"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def task_created(self, event):
        await self.send_json(event)

    async def task_updated(self, event):
        await self.send_json(event)

    async def task_deleted(self, event):
        await self.send_json(event)
