from django.contrib import admin
from .models import CustomUser
# Register your models here.



class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone_number', 'is_verified')
    # search_fields = ('email', 'phone_number')
    # list_filter = ('is_verified',)

admin.site.register(CustomUser, CustomUserAdmin)