from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TechnologyViewSet , ContactViewSet  , CertificationViewSet   

# El router crea automáticamente todas las rutas necesarias (GET, POST, PUT, DELETE)
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'technologies', TechnologyViewSet)
router.register(r'contact', ContactViewSet)
router.register(r'certifications', CertificationViewSet)
urlpatterns = [
    path('', include(router.urls)),
]