from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import get_user_model
import logging


logger = logging.getLogger(__name__)

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'phone_number', 'is_verified', 'is_active', 'is_staff']


    def validate(self, data):

        if data['password'] != data['re_password']:
            raise serializers.ValidationError({
                're_password': "Passwords don't match"
            })
        return data

    def create(self, validated_data):
        print("creating a user! ")
        validated_data.pop('re_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user