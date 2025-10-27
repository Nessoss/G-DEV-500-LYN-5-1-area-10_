# Documentation des Endpoints API

## Auth (/auth)

POST /auth/register
Crée un nouveau compte utilisateur avec email/mot de passe et retourne un token JWT.

POST /auth/login
Authentifie un utilisateur avec email/mot de passe et retourne un token JWT (avec rate limiting anti-bruteforce).

POST /auth/logout
Déconnecte l'utilisateur en supprimant le cookie refresh token.

POST /auth/oauth2/google
Authentifie un utilisateur via Google OAuth2 et retourne un token JWT.

---

## Connections (/connections)

POST /connections/github/start
Démarre le processus OAuth GitHub et retourne l'URL d'autorisation avec un état CSRF.

POST /connections/github/complete
Finalise la connexion GitHub avec le code OAuth et enregistre le token d'accès de l'utilisateur.

GET /connections
Liste tous les services connectés de l'utilisateur avec leur statut de connexion.

---

## Letterboxd (/letterboxd)

GET /letterboxd/test
Teste manuellement la récupération du flux RSS Letterboxd pour un utilisateur donné (pour debug).

POST /letterboxd/poll
Déclenche manuellement le polling RSS de tous les flux Letterboxd des Areas actives.

---

## Services (/services)

GET /services
Liste tous les services disponibles avec leurs actions, réactions et schémas de configuration.

---

## App (/)

GET /
Retourne un message de bienvenue simple de l'API.

GET /about.json
Retourne les informations sur l'API (version, services disponibles, etc.) au format JSON standardisé.

---

## OpenWeather (/openweather)

GET /openweather/current
Récupère manuellement les données météo actuelles pour une ville donnée via l'API OpenWeatherMap.

GET /openweather/poll
Déclenche manuellement le polling de toutes les Areas configurées avec OpenWeather.

---

## Areas (/areas)

POST /areas
Crée une nouvelle Area (automatisation action → réaction) pour l'utilisateur authentifié.

GET /areas
Liste toutes les Areas de l'utilisateur avec leurs détails (action, réaction, configuration, statut).

PUT /areas/:id
Active ou désactive une Area spécifique de l'utilisateur.

PATCH /areas/:id
Modifie une Area existante (nom, action, réaction, configurations).

DELETE /areas/:id
Supprime définitivement une Area de l'utilisateur.

---

## GitHub (/github)

GET /github/test
Teste manuellement la récupération d'activités GitHub pour un repository spécifique (issues, PRs, releases).

POST /github/poll
Déclenche manuellement le polling de toutes les Areas configurées avec des actions GitHub.

---

Total: 20 endpoints répartis sur 8 contrôleurs.
