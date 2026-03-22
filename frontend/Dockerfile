FROM node:20-slim

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Arrancamos en modo desarrollo (para que veas los cambios en vivo)
CMD ["npm", "run", "dev", "--", "--host"]