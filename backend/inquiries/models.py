from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator


class Subscription(models.Model):
    class Period(models.TextChoices):
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"

    class Category(models.TextChoices):
        STREAMING = "streaming", "Streaming"
        MUSIQUE = "musique", "Musique"
        IA = "ia", "Intelligence Artificielle"
        DESIGN = "design", "Design"
        PRODUCTIVITE = "productivite", "Productivité"
        JEUX = "jeux", "Jeux Vidéo"
        AUTRE = "autre", "Autre"

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.AUTRE)
    price_cfa = models.DecimalField(max_digits=12, decimal_places=0)
    original_price_cfa = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)
    discount_percentage = models.IntegerField(default=0)
    period = models.CharField(max_length=32, choices=Period.choices)
    image = models.ImageField(upload_to='subscriptions/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if self.original_price_cfa and self.original_price_cfa > 0:
            discount = ((self.original_price_cfa - self.price_cfa) / self.original_price_cfa) * 100
            self.discount_percentage = round(discount)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Inquiry(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="inquiries",
    )
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=32)
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.PROTECT,
        related_name="inquiries",
    )
    reservation_duration = models.PositiveSmallIntegerField(
        verbose_name="Durée de la réservation (mois)",
        validators=[MinValueValidator(1), MaxValueValidator(72)],
        default=1,
    )
    promo_code = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.name:
            self.user.name = self.name
        if self.phone_number:
            self.user.phone_number = self.phone_number
        self.user.save(update_fields=['name', 'phone_number'])

    def __str__(self):
        return f"{self.name} — {self.subscription.name}"


class Feedback(models.Model):
    class Type(models.TextChoices):
        SUGGESTION = "suggestion", "Suggestion"
        BUG = "bug", "Bug"
        OTHER = "other", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="feedbacks",
    )
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.SUGGESTION)
    email = models.EmailField(blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ServiceSuggestion(models.Model):
    class Category(models.TextChoices):
        STREAMING = "streaming", "Streaming"
        MUSIQUE = "musique", "Musique"
        IA = "ia", "Intelligence Artificielle"
        DESIGN = "design", "Design"
        PRODUCTIVITE = "productivite", "Productivité"
        JEUX = "jeux", "Jeux Vidéo"
        AUTRE = "autre", "Autre"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="service_suggestions",
    )
    name = models.CharField(max_length=255)
    url = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.AUTRE)
    price = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.created_at.strftime('%Y-%m-%d')}"
    
class ContactMessage(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"