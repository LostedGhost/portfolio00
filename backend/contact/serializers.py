from rest_framework import serializers

from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    # Honeypot: real visitors never see or fill this field. If it's filled,
    # the request is almost certainly a bot — fake success without saving.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Message
        fields = ['name', 'email', 'subject', 'message', 'website']

    def create(self, validated_data):
        if validated_data.pop('website', ''):
            return Message(**validated_data)
        return Message.objects.create(**validated_data)
