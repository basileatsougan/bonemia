from django.conf import settings
from django.db import models


class Subscription(models.Model):
    class Period(models.TextChoices):
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"

    name = models.CharField(max_length=255)
    price_cfa = models.DecimalField(max_digits=12, decimal_places=0)
    period = models.CharField(max_length=32, choices=Period.choices)
    image = models.ImageField(upload_to='subscriptions/', null=True, blank=True)

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
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.user.name = self.name
        self.user.phone_number = self.phone_number
        self.user.save(update_fields=['name', 'phone_number'])

    def __str__(self):
        return f"{self.name} — {self.subscription.name}"