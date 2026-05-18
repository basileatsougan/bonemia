from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser
from .serializers import CustomUserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def resend_verification_code(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email requis'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    code = user.generate_verification_code()
    user.save()
    print(f"Nouveau code OTP pour {email}: {code}")
    return Response({'message': 'Code envoyé'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def activate_account(request, token):
    try:
        user = CustomUser.objects.get(activation_token=token, is_active=False)
    except CustomUser.DoesNotExist:
        try:
            user = CustomUser.objects.get(activation_token=token, is_active=True)
            return Response(
                {'error': 'Ce lien a déjà été utilisé'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Lien invalide ou expiré'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    if not user.is_activation_token_valid(token):
        return Response(
            {'error': 'Lien d\'activation expiré'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.is_active = True
    user.is_verified = True
    user.activation_token = None
    user.activation_token_expires_at = None
    user.save()
    
    return Response(
        {'message': 'Compte activé avec succès'}, 
        status=status.HTTP_200_OK
    )


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)