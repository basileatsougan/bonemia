import random
import string
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


def generate_unique_referral_code(user):
    """
    Generate a unique referral code for a given user.
    Prefix with BON- and 6 random alphanumeric characters.
    """
    prefix = "BON"
    if user.name and user.name.strip():
        clean_name = "".join(e for e in user.name if e.isalnum()).upper()[:4]
        if clean_name:
            prefix = f"BON-{clean_name}"
    
    while True:
        suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
        code = f"{prefix}-{suffix}"
        if not ReferralCode.objects.filter(code=code).exists():
            return code


class ReferralCode(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="referral_code_obj"
    )
    code = models.CharField(max_length=30, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} -> {self.code}"

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_unique_referral_code(self.user)
        super().save(*args, **kwargs)


class Referral(models.Model):
    class Status(models.TextChoices):
        REGISTERED = "REGISTERED", "Registered"
        COMPLETED = "COMPLETED", "Completed Order"

    referrer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="referrals_sent"
    )
    referred_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="referral_received"
    )
    code_used = models.CharField(max_length=30)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.REGISTERED
    )
    discount_percent = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.referrer.email} referred {self.referred_user.email if self.referred_user else 'Guest'} ({self.code_used})"


class ReferralReward(models.Model):
    class RewardType(models.TextChoices):
        DISCOUNT_10_PERCENT = "DISCOUNT_10_PERCENT", "10% Discount on Renewal"
        CREDIT_1000_CFA = "CREDIT_1000_CFA", "1,000 FCFA Wallet Credit"

    referrer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="referral_rewards"
    )
    referral = models.ForeignKey(
        Referral,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="rewards"
    )
    reward_type = models.CharField(
        max_length=50,
        choices=RewardType.choices,
        default=RewardType.DISCOUNT_10_PERCENT
    )
    reward_value = models.CharField(max_length=50, default="10%")
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reward {self.reward_value} for {self.referrer.email} (Used: {self.is_used})"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_referral_code_for_new_user(sender, instance, created, **kwargs):
    """Auto-generate a unique referral code whenever a user is created."""
    if created:
        ReferralCode.objects.get_or_create(user=instance)
