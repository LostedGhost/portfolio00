from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('skills', views.SkillViewSet, basename='skill')
router.register('technologies', views.TechnologyViewSet, basename='technology')
router.register('experiences', views.ExperienceViewSet, basename='experience')
router.register('statistics', views.StatisticViewSet, basename='statistic')
router.register('projects', views.ProjectViewSet, basename='project')
router.register('social-links', views.SocialLinkViewSet, basename='social-link')
router.register('education', views.EducationViewSet, basename='education')
router.register('certifications', views.CertificationViewSet, basename='certification')
router.register('testimonials', views.TestimonialViewSet, basename='testimonial')

urlpatterns = [
    path('profile/', views.ProfileDetailView.as_view(), name='profile-detail'),
    path('contact-info/', views.ContactInfoDetailView.as_view(), name='contact-info-detail'),
    path('', include(router.urls)),
]
