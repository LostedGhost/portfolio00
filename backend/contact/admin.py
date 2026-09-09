from django.contrib import admin

from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'read')
    list_filter = ('read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at', 'ip_address')
    actions = ['mark_as_read', 'mark_as_unread']

    def has_add_permission(self, request):
        return False

    def mark_as_read(self, request, queryset):
        queryset.update(read=True)
    mark_as_read.short_description = 'Marquer comme lu'

    def mark_as_unread(self, request, queryset):
        queryset.update(read=False)
    mark_as_unread.short_description = 'Marquer comme non lu'
