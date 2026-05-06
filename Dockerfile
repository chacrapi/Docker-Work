# Usamos una imagen base oficial de Node.js
FROM node:18-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el package.json e instalamos dependencias
COPY package.json ./
RUN npm install

# Copiamos el resto de la aplicación (incluyendo app.js)
COPY . .

# Exponemos el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
