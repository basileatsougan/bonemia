from django.contrib import admin

# Register your models here.
from .models import Inquiry, Subscription


class InquiryAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'phone_number', 'subscription', 'created_at')

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'price_cfa', 'period', 'image')

admin.site.register(Inquiry, InquiryAdmin)
admin.site.register(Subscription, SubscriptionAdmin)