from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from account.views import resend_verification_code, activate_account, CurrentUserView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/users/resend_code/', resend_verification_code, name='resend_code'),
    path('auth/activate/<str:token>/', activate_account, name='activate_account'),
    path('api/me/', CurrentUserView.as_view(), name='current-user'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/', include('inquiries.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]