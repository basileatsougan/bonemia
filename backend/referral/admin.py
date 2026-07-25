from django.contrib import admin
from .models import ReferralCode, Referral, ReferralReward


@admin.register(ReferralCode)
class ReferralCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'user', 'created_at')
    search_fields = ('code', 'user__email')
    readonly_fields = ('created_at',)


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred_user', 'code_used', 'status', 'discount_percent', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('referrer__email', 'referred_user__email', 'code_used')


@admin.register(ReferralReward)
class ReferralRewardAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'reward_type', 'reward_value', 'is_used', 'used_at', 'created_at')
    list_filter = ('reward_type', 'is_used', 'created_at')
    search_fields = ('referrer__email',)
