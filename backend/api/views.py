from rest_framework import viewsets
from .models import Project, Technology, ContactMessage , Certification , JobOpportunity, Profile
from .serializers import ProjectSerializer, TechnologySerializer,ContactSerializer , CertificationSerializer , JobOpportunitySerializer , ProfileSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics, permissions,status
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
    permission_classes = [permissions.AllowAny]

    # Interceptamos la petición POST de n8n
    def create(self, request, *args, **kwargs):
        vacante_id = request.data.get('vacante_id')

        if vacante_id:
            # Separamos el ID del resto de los datos que se van a actualizar
            defaults = {key: value for key, value in request.data.items() if key != 'vacante_id'}

            # --- BLINDAJE EXTRA (Opcional pero recomendado) ---
            # Si tú ya marcaste este trabajo como "POSTULADO" en tu panel, 
            # evitamos que n8n lo sobreescriba y lo regrese a "Pendiente" o "ACTIVO".
            if JobOpportunity.objects.filter(vacante_id=vacante_id, estado='Postulado').exists():
                defaults.pop('estado', None)

            # La magia de Django: Busca el ID. Si lo encuentra, actualiza con 'defaults'. Si no, lo crea.
            job, created = JobOpportunity.objects.update_or_create(
                vacante_id=vacante_id,
                defaults=defaults
            )

            serializer = self.get_serializer(job)

            # Le respondemos a n8n: 201 si es nuevo, 200 si solo lo actualizamos
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )

        # Si por alguna razón n8n no manda ID, dejamos que Django maneje el error normalmente
        return super().create(request, *args, **kwargs)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]