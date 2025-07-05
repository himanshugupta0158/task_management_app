import hashlib

from django.core.cache import cache
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.select_related("created_by", "assigned_to").all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["due_date", "priority", "assigned_to"]
    ordering_fields = ["due_date", "priority", "created_at"]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_superuser:
            return queryset

        if user.is_staff:
            return queryset.filter(
                Q(created_by=user)
                | Q(assigned_to=user)
                | Q(assigned_to__is_staff=False, assigned_to__is_superuser=False)
            ).distinct()

        return queryset.filter(Q(created_by=user) | Q(assigned_to=user))

    def list(self, request, *args, **kwargs):
        filters = request.GET.dict()
        user_id = request.user.id
        key_raw = f"tasks:{user_id}:{str(sorted(filters.items()))}"
        key = hashlib.md5(key_raw.encode()).hexdigest()

        data = cache.get(key)
        if data:
            return Response(data)

        response = super().list(request, *args, **kwargs)
        cache.set(key, response.data, timeout=300)
        return response

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        cache.delete_pattern(f"tasks:{self.request.user.id}:*")


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.select_related("created_by", "assigned_to").all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_superuser:
            return queryset

        elif user.is_staff:
            return queryset.filter(
                Q(created_by=user)
                | Q(assigned_to=user)
                | Q(assigned_to__is_staff=False, assigned_to__is_superuser=False)
            ).distinct()

        else:
            return queryset.filter(created_by=user)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


class TaskStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        created_tasks = Task.objects.filter(created_by=user).count()
        assigned_tasks = Task.objects.filter(assigned_to=user).count()
        completed_tasks = Task.objects.filter(
            Q(status="completed", created_by=user)
            | Q(status="completed", assigned_to=user)
        )
        pending_tasks = Task.objects.filter(
            Q(status="pending", created_by=user) | Q(status="pending", assigned_to=user)
        )

        return Response(
            {
                "created": created_tasks,
                "assigned": assigned_tasks,
                "completed": completed_tasks.distinct().count(),
                "pending": pending_tasks.distinct().count(),
            }
        )
