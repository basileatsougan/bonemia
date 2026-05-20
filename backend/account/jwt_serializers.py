"""SimpleJWT token obtain: email + optional password, or email + verification code."""

from datetime import timedelta

from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings as jwt_api_settings

User = get_user_model()

VERIFICATION_CODE_EXPIRY_MINUTES = 15


class EmailCodeTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    - Staff / users with a password: ``email`` + ``password`` (omit ``code``).
    - Passwordless: ``email`` + ``code`` (omit or leave ``password`` empty).
    """

    code = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        help_text="Emailed verification code. Required if password is not provided.",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password"] = serializers.CharField(
            style={"input_type": "password"},
            write_only=True,
            required=False,
            allow_blank=True,
            help_text="Optional for passwordless users; use verification code instead.",
        )

    def validate(self, attrs):
        email = attrs.get(self.username_field)
        password = (attrs.get("password") or "").strip()
        code = (attrs.get("code") or "").strip()

        if password:
            authenticate_kwargs = {
                self.username_field: email,
                "password": password,
            }
            try:
                authenticate_kwargs["request"] = self.context["request"]
            except KeyError:
                pass
            self.user = authenticate(**authenticate_kwargs)
        else:
            if not code:
                raise serializers.ValidationError(
                    {
                        "code": "This field is required when password is not provided.",
                    }
                )
            try:
                user = User.objects.get(**{self.username_field: email})
            except User.DoesNotExist:
                raise exceptions.AuthenticationFailed(
                    self.error_messages["no_active_account"],
                    "no_active_account",
                )

            if not user.verification_code:
                raise serializers.ValidationError(
                    {
                        "code": "No verification code found. Request a new one.",
                    }
                )
            if user.verification_code != code:
                raise serializers.ValidationError(
                    {"code": "Invalid verification code."}
                )
            if user.verification_code_created_at is None or (
                user.verification_code_created_at
                < timezone.now()
                - timedelta(minutes=VERIFICATION_CODE_EXPIRY_MINUTES)
            ):
                raise serializers.ValidationError(
                    {
                        "code": "Verification code has expired. Request a new one.",
                    }
                )

            user.verification_code = None
            user.verification_code_created_at = None
            user.is_verified = True
            user.is_active = True
            user.save(
                update_fields=[
                    "verification_code",
                    "verification_code_created_at",
                    "is_verified",
                    "is_active",
                ]
            )
            self.user = user

        if not self.user or not jwt_api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )

        refresh = self.get_token(self.user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        if jwt_api_settings.UPDATE_LAST_LOGIN:
            jwt_api_settings.ON_LOGIN_SUCCESS(
                self.user, self.context.get("request")
            )
        return data