# Letterboxd Service

Ce module permet d'intégrer Letterboxd avec l'application AREA en utilisant les flux RSS publics de Letterboxd.

## Fonctionnalités

### Actions (Triggers)

Le service Letterboxd propose les actions suivantes :

1. **new_review** - Déclenché quand une nouvelle critique est postée
   - Configuration : `username` (string, requis)

2. **new_diary_entry** - Déclenché quand un film est ajouté au journal
   - Configuration : `username` (string, requis)

3. **film_watched** - Déclenché quand un film est marqué comme vu
   - Configuration : `username` (string, requis)

4. **new_list** - Déclenché quand une nouvelle liste est créée
   - Configuration : `username` (string, requis)

5. **film_rated** - Déclenché quand un film est noté (1-5 étoiles)
   - Configuration : `username` (string, requis), `minRating` (number, optionnel)

### Reactions (Responses)

1. **send_webhook** - Envoie les détails du film à une URL webhook
   - Configuration : `webhookUrl` (string, requis), `includeReview` (boolean, optionnel)

2. **log_activity** - Log l'activité dans la console
   - Configuration : `logLevel` (string, optionnel : 'info' | 'debug' | 'verbose')

## Installation

### 1. Ajouter le service en base de données

```bash
npm run prisma:seed
```

Cela va créer :
- Le service Letterboxd
- 5 actions (triggers)
- 2 reactions (responses)

### 2. Vérifier que le module est chargé

Le module est automatiquement chargé dans `app.module.ts` :

```typescript
imports: [
  // ...
  LetterboxdModule,
]
```

### 3. Démarrer l'application

```bash
npm run start:dev
```

Le polling RSS se déclenche automatiquement toutes les 5 minutes grâce au cron job.

## Utilisation

### Via l'API REST

#### 1. Créer un Area (workflow)

```bash
POST /areas
Authorization: Bearer <token>

{
  "name": "Letterboxd vers Webhook",
  "actionId": 1,  // ID de l'action Letterboxd
  "reactionId": 2, // ID de la reaction webhook
  "actionConfig": {
    "username": "username_letterboxd"
  },
  "reactionConfig": {
    "webhookUrl": "https://webhook.site/xxx",
    "includeReview": true
  }
}
```

#### 2. Lister les services disponibles

```bash
GET /services
```

Retourne la liste des services incluant Letterboxd avec ses actions et reactions.

### Endpoints de test

#### Tester le flux RSS d'un utilisateur

```bash
GET /letterboxd/test?username=example
Authorization: Bearer <token>
```

Retourne les 10 dernières activités de l'utilisateur.

#### Déclencher manuellement le polling

```bash
POST /letterboxd/poll
Authorization: Bearer <token>
```

Force le polling immédiat de tous les flux RSS actifs.

## Architecture

### Polling RSS

Le service utilise `rss-parser` pour récupérer les flux RSS de Letterboxd :

```
https://letterboxd.com/{username}/rss/
```

### Déduplication

Les événements déjà traités sont stockés dans la table `WebhookEvent` avec :
- `serviceId` : ID du service Letterboxd
- `externalId` : URL unique de l'activité Letterboxd
- `payload` : Données de l'activité

### Logs d'exécution

Chaque exécution de reaction est loggée dans `AreaLog` :
- `status` : success / failure / skipped
- `payload` : Données de l'événement
- `error` : Message d'erreur le cas échéant

## Exemple de payload webhook

Quand une action est déclenchée, la reaction `send_webhook` envoie ce format :

```json
{
  "type": "review",
  "film": {
    "title": "The Shawshank Redemption",
    "year": 1994,
    "rating": 5,
    "url": "https://letterboxd.com/user/film/the-shawshank-redemption/"
  },
  "review": "Amazing film about hope and friendship...",
  "watchedDate": "2025-10-16T00:00:00.000Z",
  "activityDate": "2025-10-16T12:30:00.000Z",
  "isRewatch": false
}
```

## Limitations

1. **Pas d'API officielle** : Le service utilise les flux RSS publics de Letterboxd
2. **Délai de mise à jour** : Les flux RSS ne sont pas en temps réel (délai ~5-10 min)
3. **Pas d'écriture** : Letterboxd n'expose pas d'API d'écriture publique, donc les reactions natives sont limitées
4. **Rate limiting** : Éviter de spam les flux RSS de Letterboxd

## Dépannage

### Le polling ne fonctionne pas

Vérifier que :
1. `@nestjs/schedule` est installé
2. `ScheduleModule.forRoot()` est dans `LetterboxdModule`
3. Les logs montrent : "Starting Letterboxd RSS polling..."

### Les événements ne sont pas déclenchés

Vérifier que :
1. L'Area est activée (`enabled: true`)
2. Le username Letterboxd est correct
3. L'utilisateur a de l'activité récente sur Letterboxd
4. Les logs montrent : "Found X active Letterboxd areas"

### Erreur lors du fetch RSS

```
Failed to fetch RSS feed for {username}
```

Causes possibles :
- Username invalide
- Compte Letterboxd privé
- Problème de connexion réseau

## Évolutions futures

- [ ] Support des webhooks temps réel de Letterboxd (si disponible)
- [ ] Filtres avancés (genre, décennie, acteurs)
- [ ] Agrégation d'activités (digest hebdomadaire)
- [ ] Support des listes personnalisées
- [ ] Intégration avec TMDB pour enrichir les métadonnées
