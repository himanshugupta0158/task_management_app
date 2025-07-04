from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]

    def get_role(self, obj):
        return obj.role


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_password(self, value):
        validate_password(value)
        return value

    def update(self, instance, validated_data):
        if "password" in validated_data:
            instance.set_password(validated_data.pop("password"))
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
