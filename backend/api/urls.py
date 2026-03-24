from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TechnologyViewSet, ContactViewSet, CertificationViewSet, ProfileViewSet # <-- Añadimos ProfileViewSet
from .views import JobOpportunityListCreate

# El router crea automáticamente todas las rutas necesarias (GET, POST, PUT, DELETE)
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'technologies', TechnologyViewSet)
router.register(r'contact', ContactViewSet)
router.register(r'certifications', CertificationViewSet)
router.register(r'profile', ProfileViewSet) # <-- LA MAGIA DEL VIEWSET

urlpatterns = [
    path('', include(router.urls)),
    path('jobs/', JobOpportunityListCreate.as_view(), name='job-list-create'),
]