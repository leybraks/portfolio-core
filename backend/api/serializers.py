from rest_framework import serializers
from .models import Project, Technology ,ContactMessage, Certification, JobOpportunity , Profile

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    # Esto hace que al pedir un proyecto, nos traiga la información completa de las tecnologías, no solo su ID
    technologies = TechnologySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
    def to_representation(self, instance):
        response = super().to_representation(instance)
        # Cambiamos la lista de IDs por una lista de Nombres reales
        response['technologies'] = [tech.name for tech in instance.technologies.all()]
        return response

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'

class JobOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpportunity
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'