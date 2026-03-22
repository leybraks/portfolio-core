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