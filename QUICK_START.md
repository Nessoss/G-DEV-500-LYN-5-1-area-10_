# Quick Start : Notifications Letterboxd → Discord

Configuration rapide en 3 étapes pour recevoir les notifications Letterboxd sur Discord.

## 🚀 Configuration Rapide

### 1. Créer un webhook Discord (2 min)

1. Ouvrez Discord → Paramètres du serveur → Intégrations → Webhooks
2. Cliquez sur "Nouveau Webhook"
3. Nommez-le "Letterboxd Bot"
4. Choisissez le canal de destination
5. Copiez l'URL du webhook

### 2. Tester le webhook (30 sec)

```bash
./test-discord-webhook.sh "VOTRE_URL_WEBHOOK_DISCORD"
```

Vous devriez voir un message de test apparaître dans votre canal Discord.

### 3. Configurer l'automatisation (1 min)

```bash
# Démarrez le backend
docker-compose up -d server

# Attendez 5 secondes
sleep 5

# Configurez l'AREA pour l'utilisateur "alness"
./setup-letterboxd-discord.sh "VOTRE_URL_WEBHOOK_DISCORD" "alness"
```

## ✅ C'est fait !

Le système surveillera automatiquement le compte Letterboxd d'alness toutes les 5 minutes.

## 🧪 Tester immédiatement

```bash
# Récupérez le token affiché par le script
export TOKEN="votre_token_ici"

# Déclenchez le polling manuel
curl -X POST http://localhost:8080/letterboxd/poll \
  -H "Authorization: Bearer $TOKEN"
```

## 📱 À quoi s'attendre

Chaque fois qu'alness ajoute un film à son journal Letterboxd, vous recevrez une notification Discord avec :

- 🎬 Titre et année du film
- ⭐ Note (avec des étoiles visuelles)
- 📅 Type d'activité
- 📆 Date de visionnage
- 💬 Critique (si disponible)
- 🔗 Lien vers la page Letterboxd

## 📚 Documentation complète

Pour plus de détails, consultez [LETTERBOXD_DISCORD_GUIDE.md](LETTERBOXD_DISCORD_GUIDE.md)

## 🔧 Dépannage rapide

**Problème : Le script ne trouve pas le service Letterboxd**
```bash
docker-compose exec server npm run seed
```

**Problème : Le webhook Discord ne fonctionne pas**
```bash
# Testez directement le webhook
./test-discord-webhook.sh "VOTRE_URL_WEBHOOK"
```

**Problème : Voir les logs**
```bash
docker-compose logs -f server
```

## 🎯 Exemple de résultat

Après configuration, quand alness regarde un film, vous recevrez :

```
╔══════════════════════════════════════════╗
║      Nouvelle activité Letterboxd        ║
╠══════════════════════════════════════════╣
║                                          ║
║  🎬 Film                                 ║
║  The Matrix (1999)                       ║
║                                          ║
║  ⭐ Note          📅 Type                ║
║  ⭐⭐⭐⭐⭐ (5/5)    Journal               ║
║                                          ║
║  📆 Date de visionnage                   ║
║  19/10/2025                              ║
║                                          ║
║  💬 Critique                             ║
║  Film révolutionnaire qui a changé...   ║
║                                          ║
╚══════════════════════════════════════════╝
```

---

**Temps total de configuration : ~5 minutes** ⏱️
