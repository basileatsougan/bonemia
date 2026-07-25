from rest_framework import serializers
from .models import ReferralCode, Referral, ReferralReward


class ReferralCodeSerializer(serializers.ModelSerializer):
    total_referrals = serializers.SerializerMethodField()
    successful_referrals = serializers.SerializerMethodField()
    earned_rewards_count = serializers.SerializerMethodField()

    class Meta:
        model = ReferralCode
        fields = ['code', 'created_at', 'total_referrals', 'successful_referrals', 'earned_rewards_count']

    def get_total_referrals(self, obj):
        return Referral.objects.filter(referrer=obj.user).count()

    def get_successful_referrals(self, obj):
        return Referral.objects.filter(referrer=obj.user, status=Referral.Status.COMPLETED).count()

    def get_earned_rewards_count(self, obj):
        return ReferralReward.objects.filter(referrer=obj.user).count()


class ValidateReferralCodeSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=30, required=True)

    def validate_code(self, value):
        code_clean = value.strip().upper()
        try:
            referral_code_obj = ReferralCode.objects.get(code__iexact=code_clean)
        except ReferralCode.DoesNotExist:
            raise serializers.ValidationError("Code de parrainage invalide ou inexistant.")

        request = self.context.get("request")
        if request and request.user.is_authenticated and referral_code_obj.user == request.user:
            raise serializers.ValidationError("Vous ne pouvez pas utiliser votre propre code de parrainage.")

        return code_clean


class ReferralRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralReward
        fields = ['id', 'reward_type', 'reward_value', 'is_used', 'used_at', 'created_at']


class ReferralStatsSerializer(serializers.Serializer):
    code = serializers.CharField()
    total_referrals = serializers.IntegerField()
    successful_referrals = serializers.IntegerField()
    rewards = ReferralRewardSerializer(many=True)
