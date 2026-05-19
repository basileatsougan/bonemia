from django.urls import path
from .views import resend_verification_code

urlpatterns = [
    path("auth/resend-verification-code/", resend_verification_code, name="resend_verification_code"),
]