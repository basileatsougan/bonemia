from django.urls import path
from .views import InquiryCreateView, SubscriptionListView, FeedbackCreateView, ServiceSuggestionCreateView, ContactMessageCreateView

urlpatterns = [
    path("subscriptions/", SubscriptionListView.as_view(), name="subscription-list"),
    path("inquiries/", InquiryCreateView.as_view(), name="inquiry-create"),
    path("feedbacks/", FeedbackCreateView.as_view(), name="feedback-create"),
    path("suggestions/", ServiceSuggestionCreateView.as_view(), name="suggestion-create"),
    path("contact/", ContactMessageCreateView.as_view(), name="contact-create"),
]