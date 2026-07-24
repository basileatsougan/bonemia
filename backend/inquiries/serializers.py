from rest_framework import serializers
from .models import Inquiry, Subscription, Feedback, ServiceSuggestion
from .models import Inquiry, Subscription, Feedback, ServiceSuggestion, ContactMessage


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'name', 'slug', 'description', 'category', 'price_cfa', 'original_price_cfa', 'discount_percentage', 'period', 'image']


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ["id", "name", "phone_number", "subscription", "reservation_duration", "promo_code", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["id", "type", "email", "message", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


class ServiceSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSuggestion
        fields = ["id", "name", "url", "category", "price", "description", "reason", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)
    

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "message", "created_at"]
        read_only_fields = ["id", "created_at"]