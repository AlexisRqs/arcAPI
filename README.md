# arcAPI

arcAPI est une API gratuite de type ReST basée sur OpenAPI. 

Pour fonctionner, nous avons utilisé une alternative aux bases de données, plus simples mais moins complète. Pour ce faire, nous utilisons un fichier .json appelé "parkings.json"

L'idéal serait d'avoir une API avec une page en HTTPS. Pour l'instant, l'API est uniquement utilisable en local.

Dans le Swagger, toutes les requêtes CRUD dont un utilisateur peut se servir sont à disposition. Pour tester les requêtes, nous utilisons [Postman](postman.com).

  > <i> À savoir : l'utilisateur doit se renseigner (authentification) afin d'obtenir un token pour réaliser ces actions </i>

<hr>
<p align="center">
- Projet réalisé par Axel.C & Alexis.R -
</p>
<hr>
<br>

# Installation 

## Clonez le repository

```bash
git clone https://github.com/AlexisRqs/arcAPI.git
```

<br>

## Installez [npm](https://www.npmjs.com/) ainsi que [node.js](https://nodejs.org/).

```bash
npm install -g npm
```

<br>

## Téléchargez [swagger](https://www.npmjs.com/package/swagger) via [npm](https://www.npmjs.com/)

```bash
npm install -g swagger
```
  > <i>Swagger est directement intégré au sein du code dans [index.js](https://github.com/AlexisRqs/arcAPI/blob/master/index.js)</i>

<br><br>
# Mise en route et tests

## Lancez un serveur local

```bash
node index.js
```

<br>

À l'aide de Postman, faire un <b>POST</b> à l'adresse suivante ;
  > http://localhost:8080/api/login
<br>
puis d'insérer le code ci-dessous afin d'afficher l'<i>access token</i>

```bash
 {
    "email": "inconnu@gmail.com",
    "password": "cuillere"
}
```
<br><br>
## Autres adresses

  > http://localhost:8080/api/me

Après avoir récupéré l'<i>access token</i>, faites un <b>GET</b> dans cet URL, puis aller dans Authorization avec le type Bearer Token, et y metre votre access token pour afficher vos informations.
<br><br>
  
  > http://localhost:8080/api/refreshToken
  
Il faudra faire un <b>POST</b> avec le token toujours dans Authorization et il vous affichea le <i>Refresh Token</i>.
<br><br>
  
  > http://localhost:8080/parkings

Mettre son token et faire un <b>GET</b> afin de voir toutes les informations, mais aussi un <b>PUT</b>, <b>POST</b>, <b>DELETE</b>.
