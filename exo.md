# Exercice

Créer un service du nom de `user` qui permet de consulter:

- Les liste des utilisateurs
- Avoir les information d'un seul utilisateur

Ce service sera lancé sur le port `3003`.

## Prise en main de nodejs et expressjs

- [La base de nodejs](https://nodejs.developpez.com/tutoriels/javascript/redecouvrir-javascript-avec-nodejs/)
- [https://devotics.fr/votre-premiere-app-nodejs-express/](https://devotics.fr/votre-premiere-app-nodejs-express/)
- [http://webiose.com/2014/04/express-js-le-micro-framework-pour-node-js/](http://webiose.com/2014/04/express-js-le-micro-framework-pour-node-js/)

## Description de API

Pour consulter la liste des utilisateurs:

```http
GET /users

Host: localhost:3003
```

Et la réponse devra respecter se format:

```json
{
  "data": [
    {
      "name": "Kone Moussa",
      "email": "kone@example.com",
      "password": "$2a$10$.6hUIuNusngj5k5F70jwoeqVZckb3Ks",
      "date": "2018-11-22 20:51:47"
    },
    {
      "name": "Moussa Dakia",
      "email": "moussa@example.com",
      "password": "$2a$10$Lrt4HKHuse6OQvH8OX7lyu",
      "date": "2018-11-22 20:51:47"
    },
    ...
  ],
  "status": {
    "message": "Ok",
    "error": false
  }
}
```

Pour consulter un utilisateur:

```http
GET /users/{id}

Host: localhost:3003
```

Et la réponse devra respecter se format:

```json
{
  "data": {
    "name": "Kone Moussa",
    "email": "kone@example.com",
    "password": "$2a$10$.6hUIuNusngj5k5F70jwoeqVZckb3Ks.kudgdn0fL9xFjqOFDj49m",
    "date": "2018-11-22 20:51:47"
  },
  "status": {
    "message": "Ok",
    "error": false
  }
}
```

> **{id}** est l'identifiant d'un utilisateur

Exemple:

```http
GET /users/5bf716e354fb632b98ed237d

Host: localhost:3003
```

## Comment faire l'exercice

Dans dossier `services` ajoutez un fichier `user.js` et ajoutez-y le code suivant:

```js
const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', (req, res) => {

  // Coder ICI
  
  res.send({status: {message: 'OK', error: false}, data: []});
});

app.use('/users/:id', (req, res) => {
  let { id } = req.params;

  // Coder ICI 

  res.send({status: {message: 'OK', error: false}, data: {});
});

module.exports = app;
```

Ensuite lancez votre service avec la commande:

```bash
ENV_SERVICE=user PORT=3003 node ./bin/www
```

Pour ceux qui sont sur Windows, ça sera un peu différent:

```bash
set ENV_SERVICE=user && set PORT=3003 && node ./bin/www
```
