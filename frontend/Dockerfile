# Utilisez une image de base Node.js
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers du projet dans le conteneur
COPY . .

# Exécutez la commande de build pour générer les fichiers statiques
RUN npm run build

# Utilisez un serveur HTTP léger pour servir les fichiers statiques
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html

# Exposez le port sur lequel votre application écoute
EXPOSE 80

# Démarrez le serveur nginx
CMD ["nginx", "-g", "daemon off;"]
