from django.contrib import admin
from .models import Subscription, Inquiry, Feedback
from .models import Subscription, Inquiry, Feedback, ServiceSuggestion
from .models import Subscription, Inquiry, Feedback, ServiceSuggestion, ContactMessage

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['type', 'email', 'message_preview', 'user', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['email', 'message']
    readonly_fields = ['created_at']

    def message_preview(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_preview.short_description = "Message"

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price_cfa', 'period']
    list_filter = ['category', 'period']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone_number', 'subscription', 'created_at']
    list_filter = ['subscription', 'created_at']
    search_fields = ['name', 'phone_number']

@admin.register(ServiceSuggestion)
class ServiceSuggestionAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'user', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description', 'reason']
    readonly_fields = ['created_at']  

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['email', 'message_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['email', 'message', 'name']
    readonly_fields = ['created_at']

    def message_preview(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_preview.short_description = "Message"