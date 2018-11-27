## Web Service App

Ceci est un exemple pour une application de service Web basée sur `nodejs`,` express` et `mongodb`, trois services Web ont été intégrés.

Liste de services Web:

- Mailer
- File Uploader
- Auth system With JWT

## Déploiment

### Préréquis

Installez les dépendances suivantes, sur votre PC:

- [Nodejs](https://nodejs.org)
- Mongodb (L'application utilise [mlab.com](https://mlab.com)), mais vous pouvez modifier le DSN de la connexion dans le fichier `config.js`.
- Npm or Yarn (Choisissez)
- [Git](https://git-scm.com) (Ou vous pouvez [télécharger](https://github.com/adeielevate/webservice/archive/master.zip) l'application en cliquant sur le bouton en hout à droit)
- [Maildev](https://danfarrelly.nyc/MailDev) - C'est un serveur mail pour les environements de développement.

#### Maildev

Pour installer MailDev:

```bash
npm install -g maildev
```

Lancer avec la commande suivante:

```bash
maildev
```

### Installation

Pour installer l'application, suivez les instructions suivantes:

```bash
git clone https://github.com/adeielevate/webservice --depth=1
cd webservice
npm install
```

Ou si vous n'avez pas `git` télécharger directement le projet [ici](https://github.com/adeielevate/webservice/archive/master.zip)

### Lancer le service

Pour lancer le service, assurez-vous que vous êtes dans le dossier `webservice` ou si vous avez modifier le dossier; lancer dans le nouveau dossier:

#### Lancer le service Auth

```bash
# je suis dans le dossier de l'application
ENV_SERVICE=auth PORT=3000 node ./bin/www
```

#### Lancer le service mailer

```bash
# je suis dans le dossier de l'application
ENV_SERVICE=mailer PORT=3001 node ./bin/www
```

#### Lancer le service uploader

```bash
# je suis dans le dossier de l'application
ENV_SERVICE=uploader PORT=3002 node ./bin/www
```

> Dans notre cas d'utilisation le service **Auth** doit être sur le PORT 3000

## Description des Services

On nous appris qu'un service communique avec d'autre service dans un système hétérogène au travers d'API qui permet au service de s'auto-décrire.

Alors voici les descriptions (API REST) de chaque service:

## Service AUTH

Ce service permet d'authifier un utilisateur sur le système général.

Après chaque requête le service retourne une information descrivant l'état de la requête.

### Login

#### Requête

```http
POST /login

Content-Type: application/x-form-www-urlencoded
Host: locahost:3000

email=example@email.com&password=password
```

#### Réponse

```http
HTTP/1.0 200 OK
Date: Sat, 15 Jan 2018 14:37:12 GMT
Server: Expressjs
Content-Type: application/json

{
  "data": {
    "token": "Votre-Token-Valide",
    "createdAt": 1542973175398
  },
  "status": {
    "message": "message",
    "error": "boolean"
  }
}
```

> `data` peut être vide.

### Register

#### Requête

```http
POST /register

Content-Type: application/x-form-www-urlencoded
Host: locahost:3000

email=example@email.com&password=password&name=nom
```

#### Réponse

```http
HTTP/1.0 200 OK
Date: Sat, 15 Jan 2018 14:37:12 GMT
Server: Expressjs
Content-Type: application/json

{
  "data": {
    "token": "Votre-Token-Valide",
    "createdAt": 1542973175398
  },
  "status": {
    "message": "message",
    "error": "boolean"
  }
}
```

### Vérifier un token

#### Requête

```http
POST /veridy

Host: locahost:3000
X-Access-Token: Votre-Token-Valide
```

#### Réponse

```http
HTTP/1.0 200 OK
Date : Sat, 15 Jan 2018 14:37:12 GMT
Server : Expressjs
Content-Type : application/json

{
  "data": {
  },
  "status": {
    "message": "message",
    "error": "boolean"
  }
}
```

## Service Upload

Ce service permet d'envoyer des fichiers sur le serveur.

Avant d'utiliser ce service vous devrez disposer d'un token valide qui sera envoyé au service [`Auth`](#service-auth) pour une vérification d'authencité.

### Uploade un fichier

#### Requête

```http
POST /upload

Host: locahost:3002
Content-Type: multipart/form-data
X-Access-Token: Votre-Token-Valide
```

#### Réponse

```http
HTTP/1.0 200 OK
Date: Sat, 15 Jan 2018 14:37:12 GMT
Server: Expressjs
Content-Type: application/json

{
  "message": "message",
  "error": "boolean",
  "url": "url"
}
```

> `url` sera disponible en cas de succès

### Téléchargé un image

Le service permet aussi de télécharger une image.

```http
GET /url?filename={filename}

Host: localhost:3002
```

## Service Mailer

Ce service permet d'envoyer des emails et de vérifier la validité des emails.

Avant d'utiliser ce service vous devrez disposer d'un token valide qui sera envoyé au service [`Auth`](#service-auth) pour une vérification d'authencité.

### Vérifié un email

#### Requête

```http
POST /verify

Host: localhost:3001
Content-Type: application/x-form-www-urlencoded
X-Access-Token: Votre-Token-Valide

email=example@email.com
```

#### Réponse

```http
HTTP/1.0 201 OK
Date: Sat, 15 Jan 2018 14:37:12 GMT
Server: Expressjs
Content-Type: application/json

{
  "message": "message",
  "error": "bool",
  "url": "url"
}
```

### Envoyer un email

#### Requête

```http
POST /process

Host: localhost:3001
Content-Type: application/x-form-www-urlencoded
X-Access-Token: Votre-Token-Valide

to=destinateur@email.com&subject=objet&message=Bonjour&from=expediteur@email.com
```

#### Réponse

```http
HTTP/1.0 201 OK
Date: Sat, 15 Jan 2018 14:37:12 GMT
Server: Expressjs
Content-Type: application/json

{
  "message": "message",
  "error": "bool",
  "url": "url"
}
```
