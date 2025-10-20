# Guide : Configurer les notifications Letterboxd vers Discord

Ce guide vous explique comment recevoir automatiquement des notifications Discord à chaque nouvelle activité sur un compte Letterboxd.

## Prérequis

- Docker et docker-compose installés
- Un serveur Discord où vous avez les permissions d'administrateur
- Le backend de l'application en cours d'exécution

## Étape 1 : Créer un webhook Discord

1. Ouvrez Discord et accédez à votre serveur
2. Cliquez sur l'icône ⚙️ à côté du nom de votre serveur
3. Allez dans **Intégrations** → **Webhooks**
4. Cliquez sur **Nouveau Webhook**
5. Configurez le webhook :
   - **Nom** : `Letterboxd Bot` (ou le nom de votre choix)
   - **Canal** : Sélectionnez le canal où vous voulez recevoir les notifications
6. Cliquez sur **Copier l'URL du webhook**
7. **Important** : Gardez cette URL secrète, ne la partagez pas publiquement

L'URL ressemblera à quelque chose comme :
```
https://discord.com/api/webhooks/123456789/AbCdEfGhIjKlMnOpQrStUvWxYz
```

## Étape 2 : Configurer l'AREA avec le script automatique

Utilisez le script de configuration fourni :

```bash
# Assurez-vous que le backend est en cours d'exécution
docker-compose up -d server

# Attendez quelques secondes que le serveur démarre
sleep 5

# Exécutez le script de configuration
chmod +x setup-letterboxd-discord.sh
./setup-letterboxd-discord.sh "VOTRE_URL_WEBHOOK_DISCORD" "alness"
```

Remplacez :
- `VOTRE_URL_WEBHOOK_DISCORD` par l'URL du webhook que vous avez copiée
- `alness` par le nom d'utilisateur Letterboxd à surveiller

### Exemple :
```bash
./setup-letterboxd-discord.sh "https://discord.com/api/webhooks/123456789/AbCdEfGhIj..." "alness"
```

## Étape 3 : Vérifier la configuration

Le script affichera un résumé de la configuration :

```
================================================
   ✅ Configuration terminée avec succès!
================================================

📋 Résumé:
   • AREA ID: 1
   • Utilisateur Letterboxd: alness
   • Action: Nouvelle entrée diary
   • Réaction: Webhook Discord
   • Statut: Activé
```

## Comment ça fonctionne ?

1. **Surveillance automatique** : Le système vérifie le flux RSS de Letterboxd toutes les 5 minutes
2. **Détection des nouvelles activités** : Quand une nouvelle entrée est ajoutée au journal de l'utilisateur
3. **Notification Discord** : Un message formaté est envoyé à votre canal Discord

## Format des notifications Discord

Les notifications Discord incluent :
- 🎬 **Titre du film** et année
- ⭐ **Note** (avec des étoiles visuelles)
- 📅 **Type d'activité** (Journal, Critique, etc.)
- 📆 **Date de visionnage**
- 🔁 **Statut** (si le film a été revu)
- 💬 **Critique** (si disponible)

### Exemple de notification :

```
Nouvelle activité Letterboxd

🎬 Film
The Matrix (1999)

⭐ Note          📅 Type
⭐⭐⭐⭐⭐ (5/5)    Journal

📆 Date de visionnage
19/10/2025

💬 Critique
Un film révolutionnaire qui a changé le cinéma d'action pour toujours...
```

## Déclenchement manuel

Pour tester immédiatement sans attendre les 5 minutes :

```bash
# Récupérez votre token (affiché par le script de configuration)
export TOKEN="votre_token_ici"

# Déclenchez le polling manuellement
curl -X POST http://localhost:8080/letterboxd/poll \
  -H "Authorization: Bearer $TOKEN"
```

## Gérer vos AREAs

### Lister toutes les AREAs

```bash
curl -X GET http://localhost:8080/areas \
  -H "Authorization: Bearer $TOKEN"
```

### Désactiver une AREA

```bash
curl -X PATCH http://localhost:8080/areas/{AREA_ID} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

### Supprimer une AREA

```bash
curl -X DELETE http://localhost:8080/areas/{AREA_ID} \
  -H "Authorization: Bearer $TOKEN"
```

## Types d'activités surveillées

Vous pouvez créer plusieurs AREAs pour différents types d'activités :

1. **new_diary_entry** : Nouvelle entrée dans le journal (film vu)
2. **new_review** : Nouvelle critique publiée
3. **film_watched** : Film marqué comme vu
4. **film_rated** : Film noté
5. **new_list** : Nouvelle liste créée

## Troubleshooting

### Le webhook ne fonctionne pas

1. Vérifiez que l'URL du webhook est correcte
2. Vérifiez que le webhook Discord existe toujours
3. Consultez les logs du serveur :
   ```bash
   docker-compose logs -f server
   ```

### Les notifications sont en retard

- Le système vérifie le flux RSS toutes les 5 minutes
- Pour une vérification plus fréquente, modifiez le cron dans le fichier `letterboxd.service.ts`

### Tester le webhook Discord directement

Utilisez le script de test fourni :

```bash
./test-discord-webhook.sh "VOTRE_URL_WEBHOOK"
```

## Personnalisation avancée

### Modifier le format du message

Éditez le fichier `backend/src/letterboxd/letterboxd.service.ts` dans la méthode `sendWebhook()` pour personnaliser :
- Les couleurs des embeds
- Les champs affichés
- Le nom et l'avatar du bot

### Ajouter des filtres

Vous pouvez modifier l'action pour filtrer par note minimale :

```json
{
  "actionConfig": {
    "username": "alness",
    "minRating": 4.0
  }
}
```

## Sécurité

- **Ne partagez jamais** votre URL de webhook Discord
- **Ne committez pas** les URLs de webhook dans Git
- Utilisez des variables d'environnement pour les données sensibles
- Changez le webhook si vous pensez qu'il a été compromis

## Support

Pour toute question ou problème :
1. Consultez les logs : `docker-compose logs -f server`
2. Vérifiez que le service Letterboxd est accessible : `https://letterboxd.com/alness/rss/`
3. Testez manuellement le flux RSS avec : `curl "http://localhost:8080/letterboxd/test?username=alness"`
