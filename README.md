# Créez un réseau social d’entreprise

Vous êtes développeur depuis plus d'un an chez CONNECT-E, une petite agence web
regroupant une douzaine d'employés.
Votre directrice, Stéphanie, vient de signer un nouveau contrat avec Groupomania, un groupe
spécialisé dans la grande distribution, et l'un des plus Kdèles clients de l'agence.

Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le
but de cet outil est de faciliter les interactions entre collègues. Le département RH de
Groupomania a imaginé plusieurs fonctionnalités pour favoriser les échanges entre collègues.

### Frontend :

```
cd frontend
npm install 
npm run serve

```

### Backend :

```
cd backend
mkdir images
npm install
npm start

```

### Database :

```
cd backend
sequelize db:create
sequelize db:migrate

```

3 Comptes déjà créer avec cette commande :

```
sequelize db:seed:all

```
```
email: bob@test.fr - Password: test1
email: pat@test.fr - Pasword: test1
email: admin@test.fr - Password: test1

```
