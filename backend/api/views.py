from rest_framework import viewsets
from .models import Project, Technology, ContactMessage , Certification
from .serializers import ProjectSerializer, TechnologySerializer,ContactSerializer , CertificationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer

class ProjectViewSet(viewsets.ModelViewSet):
    # Ordenamos para que los proyectos más nuevos salgan primero
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        project = self.get_object()
        project.views_count += 1
        project.save()
        return Response({'status': 'view incremented'})

class ContactViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactSerializer

class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all().order_by('-date_earned') # Los más recientes primero
    serializer_class = CertificationSerializer