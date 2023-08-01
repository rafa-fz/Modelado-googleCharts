# Usa una imagen base que incluya un servidor web, como Node.js
FROM node:14-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos necesarios de la aplicación (asegúrate de tener el package.json)
COPY package.json .
COPY index.html .

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto 80 (o el que estés usando para el servidor web)
EXPOSE 80

# Comando para iniciar la aplicación (ajústalo si tu servidor web difiere)
CMD ["npm", "start"]
