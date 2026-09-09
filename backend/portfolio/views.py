from rest_framework.generics import RetrieveAPIView
from rest_framework.viewsets import ReadOnlyModelViewSet

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
from .serializers import (
    CertificationSerializer,
    ContactInfoSerializer,
    EducationSerializer,
    ExperienceSerializer,
    ProfileSerializer,
    ProjectSerializer,
    SkillSerializer,
    SocialLinkSerializer,
    StatisticSerializer,
    TechnologySerializer,
    TestimonialSerializer,
)


class SkillViewSet(ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class TechnologyViewSet(ReadOnlyModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer


class ExperienceViewSet(ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class StatisticViewSet(ReadOnlyModelViewSet):
    queryset = Statistic.objects.all()
    serializer_class = StatisticSerializer


class ProjectViewSet(ReadOnlyModelViewSet):
    queryset = Project.objects.prefetch_related('technologies')
    serializer_class = ProjectSerializer


class SocialLinkViewSet(ReadOnlyModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer


class EducationViewSet(ReadOnlyModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


class CertificationViewSet(ReadOnlyModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer


class TestimonialViewSet(ReadOnlyModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class ProfileDetailView(RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return Profile.load()


class ContactInfoDetailView(RetrieveAPIView):
    serializer_class = ContactInfoSerializer

    def get_object(self):
        return ContactInfo.load()
