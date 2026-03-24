from django.db import models

# Tabla para las tecnologías (ej: Python, React, SQL Server)
class Technology(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# Tabla para tus Proyectos
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    technologies = models.ManyToManyField(Technology, related_name='projects')
    github_link = models.URLField(blank=True, null=True)
    live_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    views_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje de {self.name}"

class Certification(models.Model):
    name = models.CharField(max_length=150)
    issuer = models.CharField(max_length=100) # Ej: Coursera, SENATI
    # Guardaremos el logo de la empresa para el carrusel infinito
    issuer_logo = models.ImageField(upload_to='certifications/', null=True, blank=True)
    certificate_link = models.URLField(blank=True, null=True)
    date_earned = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.issuer}"


class Profile(models.Model):
    status_es = models.CharField(max_length=150, default="Disponible para proyectos")
    status_en = models.CharField(max_length=150, default="Available for projects")

    def __str__(self):
        return "Configuración Global del Sitio"
    
class JobOpportunity(models.Model):
    vacante_id = models.CharField(max_length=100, unique=True)
    empresa = models.CharField(max_length=150)
    puesto = models.CharField(max_length=150)
    ubicacion = models.CharField(max_length=150)
    link = models.URLField(max_length=500)
    ultima_vista = models.DateTimeField(auto_now_add=True)
    habilidades_ia = models.TextField()  # Aquí guardamos el texto de la IA
    probabilidad_ia = models.FloatField() # Valor entre 0 y 1 (ej: 0.85)

    def __str__(self):
        return f"{self.puesto} @ {self.empresa}"