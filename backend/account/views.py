from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .serializers import ResendVerificationCodeSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def resend_verification_code(request):
    """
    Resend verification code to user's email.

    Expects:
        {
            "email": "user@example.com"
        }

    Returns:
        200: Verification code sent successfully
        400: Invalid email or other validation error
    """
    serializer = ResendVerificationCodeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"detail": "Verification code sent to your email."},
            status=status.HTTP_200_OK,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)