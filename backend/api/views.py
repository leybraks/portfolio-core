from rest_framework import viewsets
from .models import Project, Technology, ContactMessage , Certification , JobOpportunity
from .serializers import ProjectSerializer, TechnologySerializer,ContactSerializer , CertificationSerializer , JobOpportunitySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics, permissions
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

class JobOpportunityListCreate(generics.ListCreateAPIView):
    queryset = JobOpportunity.objects.all().order_by('-probabilidad_ia')
    serializer_class = JobOpportunitySerializer
    
    # IMPORTANTE: Por ahora lo dejamos en AllowAny para que n8n pueda enviar datos sin bloqueos.
    # Más adelante, cuando el dominio esté listo, le pondremos seguridad por Token.
    permission_classes = [permissions.AllowAny]