from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import ReferralCode, Referral, ReferralReward
from .serializers import (
    ReferralCodeSerializer,
    ValidateReferralCodeSerializer,
    ReferralRewardSerializer
)


class MyReferralCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Obtenir mon code de parrainage",
        responses={200: ReferralCodeSerializer}
    )
    def get(self, request):
        code_obj, _ = ReferralCode.objects.get_or_create(user=request.user)
        serializer = ReferralCodeSerializer(code_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ValidateReferralCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Valider un code de parrainage",
        request=ValidateReferralCodeSerializer,
        responses={
            200: OpenApiResponse(description="Code valide - Réduction appliquée"),
            400: OpenApiResponse(description="Code invalide")
        }
    )
    def post(self, request):
        serializer = ValidateReferralCodeSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return Response(
                {"valid": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        code_clean = serializer.validated_data["code"]
        referral_code_obj = ReferralCode.objects.get(code__iexact=code_clean)

        return Response(
            {
                "valid": True,
                "code": referral_code_obj.code,
                "discount_percent": 10,
                "message": "Code de parrainage valide ! 10% de réduction appliqués."
            },
            status=status.HTTP_200_OK
        )


class ReferralStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Statistiques du programme de parrainage de l'utilisateur",
    )
    def get(self, request):
        code_obj, _ = ReferralCode.objects.get_or_create(user=request.user)
        referrals = Referral.objects.filter(referrer=request.user)
        rewards = ReferralReward.objects.filter(referrer=request.user)

        return Response({
            "code": code_obj.code,
            "total_referrals": referrals.count(),
            "completed_referrals": referrals.filter(status=Referral.Status.COMPLETED).count(),
            "rewards": ReferralRewardSerializer(rewards, many=True).data
        }, status=status.HTTP_200_OK)
