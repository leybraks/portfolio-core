# Usamos una imagen ligera de Python
FROM python:3.9-slim

# Evita que Python genere archivos .pyc y permite ver logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instalamos dependencias del sistema necesarias
RUN apt-get update && apt-get install -y libpq-dev gcc

# Instalamos las librerías de Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . /app/

# Exponemos el puerto de Django
EXPOSE 8000

# Comando para arrancar el servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]