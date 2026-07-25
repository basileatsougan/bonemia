from django.urls import path
from .views import MyReferralCodeView, ValidateReferralCodeView, ReferralStatsView

urlpatterns = [
    path('my-code/', MyReferralCodeView.as_view(), name='my-referral-code'),
    path('validate-code/', ValidateReferralCodeView.as_view(), name='validate-referral-code'),
    path('stats/', ReferralStatsView.as_view(), name='referral-stats'),
]
