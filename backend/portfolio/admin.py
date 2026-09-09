from adminsortable2.admin import SortableAdminMixin
from django.contrib import admin
from django.shortcuts import redirect
from django.utils.html import format_html

from .models import (
    Certification,
    ContactInfo,
    Education,
    Experience,
    Profile,
    Project,
    Skill,
    SocialLink,
    Statistic,
    Technology,
    Testimonial,
)


def image_preview(field_name, label):
    def _preview(self, obj):
        file = getattr(obj, field_name)
        if not file:
            return '(aucune image)'
        return format_html('<img src="{}" style="max-height:80px" />', file.url)

    _preview.short_description = label
    return _preview


class SingletonAdmin(admin.ModelAdmin):
    """Admin for models that must have exactly one row: skip the changelist,
    go straight to (and never allow deleting/duplicating) the single record."""

    def has_add_permission(self, request):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.model.load()
        return redirect(f'{obj.pk}/change/')


@admin.register(Profile)
class ProfileAdmin(SingletonAdmin):
    readonly_fields = ('photo_preview', 'logo_preview', 'updated_at')
    fields = (
        'full_name', 'title', 'email', 'phone', 'available', 'description',
        'photo', 'photo_preview', 'logo', 'logo_preview', 'cv', 'updated_at',
    )
    photo_preview = image_preview('photo', 'Apercu photo')
    logo_preview = image_preview('logo', 'Apercu logo')


@admin.register(ContactInfo)
class ContactInfoAdmin(SingletonAdmin):
    fields = ('address', 'phone', 'email', 'form_active')


@admin.register(Skill)
class SkillAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'value', 'order')
    list_editable = ('value',)


@admin.register(Technology)
class TechnologyAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'logo_preview', 'order')
    readonly_fields = ('logo_preview',)
    fields = ('name', 'logo', 'logo_preview', 'order')
    logo_preview = image_preview('logo', 'Apercu')


@admin.register(Experience)
class ExperienceAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('company', 'type', 'start_date', 'end_date', 'order')
    list_filter = ('type',)


@admin.register(Statistic)
class StatisticAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('label', 'value', 'suffix', 'order')
    list_editable = ('value', 'suffix')


@admin.register(Project)
class ProjectAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('title', 'category', 'date', 'image_preview', 'order')
    readonly_fields = ('image_preview',)
    filter_horizontal = ('technologies',)
    fields = (
        'title', 'category', 'date', 'link', 'role', 'description', 'results',
        'technologies', 'image', 'image_preview', 'order',
    )
    image_preview = image_preview('image', 'Apercu')


@admin.register(SocialLink)
class SocialLinkAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('platform', 'url', 'order')


@admin.register(Education)
class EducationAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_date', 'end_date', 'order')


@admin.register(Certification)
class CertificationAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'issuer', 'date_obtained', 'order')


@admin.register(Testimonial)
class TestimonialAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('author_name', 'author_role', 'photo_preview', 'order')
    readonly_fields = ('photo_preview',)
    fields = ('author_name', 'author_role', 'content', 'photo', 'photo_preview', 'order')
    photo_preview = image_preview('photo', 'Apercu')
