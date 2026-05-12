from rest_framework import generics, permissions

from .serializers import InquirySerializer


class InquiryCreateView(generics.CreateAPIView):
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAuthenticated]
