import logging
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions as django_exceptions
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import serializers
from rest_framework.settings import api_settings

from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer

logger = logging.getLogger(__name__)

User = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
    referral_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone_number', 'created_at', 'referral_code']
        read_only_fields = ['id', 'email', 'created_at', 'referral_code']

    def get_referral_code(self, obj):
        try:
            if hasattr(obj, 'referral_code_obj'):
                return obj.referral_code_obj.code
            from referral.models import ReferralCode
            code_obj, _ = ReferralCode.objects.get_or_create(user=obj)
            return code_obj.code
        except Exception:
            return None

        
def send_verification_code_email(user, *, subject="Votre code de verification Bonemia"):
    """Persist a new code on ``user`` and email it. Raises ValidationError if mail fails."""
    code = user.generate_verification_code()
    
    # Récupérer le nom d'affichage
    if user.name and user.name.strip():
        display_name = user.name.strip()
    else:
        # Prendre la partie avant le @ et supprimer les chiffres de fin (optionnel)
        local_part = user.email.split('@')[0]
        # Supprimer les chiffres à la fin (ex: nelsbrowser18 -> nelsbrowser)
        import re
        display_name = re.sub(r'\d+$', '', local_part) or local_part
    
    context = {
        'code': code,
        'user_name': display_name,
        'user_email': user.email,
        'site_name': 'Bonemia',
        'expiry_minutes': 15,
    }
    
    html_message = render_to_string('email/verification_code.html', context)
    plain_message = strip_tags(html_message)
    
    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[user.email],
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
        logger.info("Sent verification code to %s", user.email)
    except Exception as e:
        logger.error("Failed to send verification email to %s: %s", user.email, e)
        raise serializers.ValidationError(
            {"email": f"Failed to send verification email: {str(e)}"}
        ) from e


class PasswordlessUserCreateSerializer(DjoserUserCreateSerializer):
    """
    Sign-up with email (and optional password). Sends a one-time code by email;
    the user signs in with ``POST /auth/jwt/create/`` using ``email`` + ``code``.
    """

    password = serializers.CharField(
        style={"input_type": "password"},
        write_only=True,
        required=False,
        allow_blank=True,
        help_text="Optional. Omit to register with email only; sign in with the emailed code.",
    )

    def validate(self, attrs):
        raw = attrs.get("password")
        password = (raw or "").strip()
        if not password:
            attrs.pop("password", None)
            return attrs

        attrs["password"] = password
        user = User(**{k: v for k, v in attrs.items() if k != "password"})
        try:
            validate_password(password, user)
        except django_exceptions.ValidationError as e:
            serializer_error = serializers.as_serializer_error(e)
            raise serializers.ValidationError(
                {"password": serializer_error[api_settings.NON_FIELD_ERRORS_KEY]}
            )
        return attrs

    def create(self, validated_data):
        user = super().create(validated_data)
        send_verification_code_email(user, subject="Votre code de verification Bonemia")
        return user


class ResendVerificationCodeSerializer(serializers.Serializer):
    """
    Request a new verification code to be sent to the user's email.
    """

    email = serializers.EmailField()

    def validate_email(self, value):
        """Verify that the email exists in the system."""
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "No user found with this email address."
            )
        return value

    def save(self):
        """Send verification code to the user's email."""
        email = self.validated_data["email"]
        user = User.objects.get(email=email)
        send_verification_code_email(user, subject="Votre code de verification Bonemia")