import hashlib

from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.select_related("created_by", "assigned_to").all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["due_date", "priority", "assigned_to"]
    ordering_fields = ["due_date", "priority", "created_at"]

    def list(self, request, *args, **kwargs):
        filters = request.GET.dict()
        user_id = request.user.id
        key_raw = f"tasks:{user_id}:{str(filters)}"
        key = hashlib.md5(key_raw.encode()).hexdigest()

        data = cache.get(key)
        if data:
            return Response(data)

        response = super().list(request, *args, **kwargs)
        cache.set(key, response.data, timeout=300)
        return response

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        cache.clear()  # Invalidate on create


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.select_related("created_by", "assigned_to").all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()
