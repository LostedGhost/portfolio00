from django.db import models


class Message(models.Model):
    name = models.CharField('nom', max_length=200)
    email = models.EmailField('email')
    subject = models.CharField('sujet', max_length=200, blank=True)
    message = models.TextField('message')
    created_at = models.DateTimeField('recu le', auto_now_add=True)
    read = models.BooleanField('lu', default=False)
    ip_address = models.GenericIPAddressField('adresse IP', null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'

    def __str__(self):
        return f'{self.name} - {self.subject or "(sans objet)"}'
