from rest_framework import generics, permissions
from .models import Subscription, Feedback, ServiceSuggestion
from .serializers import InquirySerializer, SubscriptionSerializer, FeedbackSerializer, ServiceSuggestionSerializer
from .models import Subscription, Feedback, ServiceSuggestion, ContactMessage
from .serializers import InquirySerializer, SubscriptionSerializer, FeedbackSerializer, ServiceSuggestionSerializer, ContactMessageSerializer


class SubscriptionListView(generics.ListAPIView):
    queryset = Subscription.objects.all().order_by('-id')
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.AllowAny]


class InquiryCreateView(generics.CreateAPIView):
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAuthenticated]


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.AllowAny]


class ServiceSuggestionCreateView(generics.CreateAPIView):
    serializer_class = ServiceSuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]