from rest_framework.generics import CreateAPIView
from rest_framework.throttling import ScopedRateThrottle

from .serializers import MessageSerializer


class MessageCreateView(CreateAPIView):
    serializer_class = MessageSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'

    def perform_create(self, serializer):
        serializer.save(ip_address=self.request.META.get('REMOTE_ADDR'))
