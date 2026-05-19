import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions as django_exceptions
from django.core.mail import send_mail
from rest_framework import serializers
from rest_framework.settings import api_settings

from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer

logger = logging.getLogger(__name__)

User = get_user_model()


def send_verification_code_email(user, *, subject="Your verification code"):
    """Persist a new code on ``user`` and email it. Raises ValidationError if mail fails."""
    code = user.generate_verification_code()
    try:
        send_mail(
            subject=subject,
            message=f"Your verification code is: {code}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )
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
        send_verification_code_email(user, subject="Your verification code")
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
        send_verification_code_email(user, subject="Your verification code")