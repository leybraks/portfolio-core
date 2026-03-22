from django.contrib import admin
from .models import Project, Technology, ContactMessage

# Configuración para que tus proyectos se vean PRO
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at') # Columnas que verás en la lista
    search_fields = ('title', 'description') # Buscador interno
    list_filter = ('technologies',) # Filtro lateral por tecnología

# Configuración para los mensajes que te envíen desde la web
@admin.register(ContactMessage)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    readonly_fields = ('created_at',) # Para que no se pueda alterar la fecha del mensaje
    search_fields = ('name', 'email', 'message')

admin.site.register(Technology)