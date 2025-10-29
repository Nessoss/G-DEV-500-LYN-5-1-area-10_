# 🚀 Guide d'Automatisation des Tunnels AREA

Ce guide explique comment utiliser le système d'automatisation des tunnels pour votre application AREA.

## 📋 Prérequis

1. **Docker & Docker Compose** installés
2. **Ngrok** (inclus dans le projet)
3. **jq** pour le parsing JSON : `sudo apt install jq`
4. **curl** pour les tests

## 🎯 Configuration Initiale

### 1. Configuration Ngrok (Optionnel mais recommandé)

Si vous avez un compte ngrok, ajoutez votre token dans `.env` :

```bash
NGROK_AUTHTOKEN=votre_token_ici
```

### 2. Configuration des Services OAuth

Dans `.env`, vos URLs seront automatiquement mises à jour, mais vous pouvez définir des valeurs par défaut :

```bash
# Ces URLs seront automatiquement remplacées par les URLs des tunnels
SPOTIFY_CALLBACK_URL=http://localhost:8080/auth/spotify/callback
GITHUB_OAUTH_REDIRECT_URI=http://localhost:8081/connections/github/callback
FRONTEND_URL=http://localhost:8081
```

## 🚀 Utilisation

### Démarrage Automatisé

```bash
# Démarrage simple
./start-app.sh

# Démarrage avec installation du service systemd
./start-app.sh --install-service
```

### Arrêt de l'Application

```bash
./stop-app.sh
```

### Gestion Manuel des Tunnels

```bash
# Vérifier le statut des tunnels
curl http://localhost:8080/tunnels/status | jq '.'

# Obtenir toutes les URLs des tunnels
curl http://localhost:8080/tunnels | jq '.'

# Obtenir une URL spécifique
curl http://localhost:8080/tunnels/backend | jq '.'
curl http://localhost:8080/tunnels/frontend | jq '.'

# Redémarrer un tunnel
curl -X POST http://localhost:8080/tunnels/backend/restart

# Vérifier les URLs OAuth actuelles
curl http://localhost:8080/tunnels/oauth/urls | jq '.'

# Forcer la mise à jour des URLs OAuth
curl -X POST http://localhost:8080/tunnels/oauth/update | jq '.'
```

## 🔧 Architecture du System

### Services Backend

1. **TunnelService** : Gestion des tunnels ngrok
2. **OAuthUpdateService** : Mise à jour automatique des URLs OAuth
3. **TunnelController** : API REST pour la gestion des tunnels

### Scripts

1. **start-app.sh** : Démarrage automatisé complet
2. **stop-app.sh** : Arrêt propre de tous les services

### Flux d'Automatisation

```
1. start-app.sh lancé
2. Extraction de ngrok si nécessaire
3. Démarrage des services Docker
4. Démarrage des tunnels ngrok
5. Récupération des URLs publiques
6. Mise à jour automatique des variables OAuth
7. Application prête avec URLs publiques
```

## 📊 Monitoring

### Vérification du Statut

```bash
# Statut complet
curl http://localhost:8080/tunnels/status | jq '.'

# Dashboard ngrok (interface web)
open http://localhost:4040
```

### Logs

```bash
# Logs des tunnels
tail -f ngrok-backend.log
tail -f ngrok-frontend.log

# Logs Docker
docker-compose logs -f server
docker-compose logs -f client_web
```

## 🔄 Fonctionnalités Automatiques

### Redémarrage Automatique

- Les tunnels se redémarrent automatiquement en cas de déconnexion
- Mise à jour automatique des URLs OAuth après redémarrage

### Gestion des Erreurs

- Nettoyage automatique des ports occupés
- Vérification de l'état des services avant démarrage
- Gestion des processus zombies

### Persistence

- URLs sauvegardées dans `tunnel-urls.env`
- PIDs des processus sauvegardés pour gestion propre
- Logs séparés pour chaque tunnel

## 🎛️ Configuration Avancée

### Variables d'Environnement

```bash
# Contrôle des tunnels
ENABLE_TUNNELS=true          # Activer/désactiver les tunnels
NGROK_AUTHTOKEN=token        # Token ngrok (optionnel)

# URLs automatiquement mises à jour
TUNNEL_BACKEND_URL=          # URL publique du backend
TUNNEL_FRONTEND_URL=         # URL publique du frontend
```

### Service Systemd (Production)

```bash
# Installation du service
./start-app.sh --install-service

# Gestion du service
sudo systemctl start area-app
sudo systemctl stop area-app
sudo systemctl status area-app
sudo systemctl enable area-app  # Démarrage automatique au boot
```

## 🐛 Dépannage

### Problèmes Courants

1. **Tunnels qui ne démarrent pas**
   ```bash
   # Vérifier les logs
   cat ngrok-backend.log
   
   # Redémarrer manuellement
   curl -X POST http://localhost:8080/tunnels/backend/restart
   ```

2. **URLs OAuth non mises à jour**
   ```bash
   # Forcer la mise à jour
   curl -X POST http://localhost:8080/tunnels/oauth/update
   
   # Vérifier le statut
   curl http://localhost:8080/tunnels/oauth/urls
   ```

3. **Ports occupés**
   ```bash
   # Le script nettoie automatiquement, mais vous pouvez le faire manuellement
   sudo lsof -ti:8080 | xargs kill -9
   sudo lsof -ti:8081 | xargs kill -9
   ```

### Commands de Debug

```bash
# Vérifier tous les processus liés
ps aux | grep -E "(ngrok|docker|node)"

# Vérifier les ports
netstat -tlnp | grep -E "(8080|8081|4040)"

# Tester la connectivité
curl http://localhost:8080/about.json
curl http://localhost:8081
```

## 🎯 Intégration avec les Services OAuth

### Spotify

Quand vous configurez votre application Spotify sur le Spotify Developer Dashboard :

1. L'URL de callback sera automatiquement `https://votre-tunnel.ngrok-free.app/auth/spotify/callback`
2. Cette URL est mise à jour automatiquement à chaque redémarrage des tunnels

### GitHub

Même principe pour GitHub OAuth Apps :

1. L'URL de callback sera `https://votre-tunnel-frontend.ngrok-free.app/connections/github/callback`
2. Mise à jour automatique

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter** les tokens ngrok dans le repository
2. **Utiliser des variables d'environnement** pour tous les secrets
3. **Surveiller les logs** pour détecter les accès non autorisés
4. **Redémarrer régulièrement** les tunnels pour changer les URLs

### Production

En production, remplacez ngrok par une solution plus robuste :
- Reverse proxy (nginx, traefik)
- Load balancer cloud
- Domain fixe avec certificats SSL

## 📈 Performance

### Optimisations

1. **Réutilisation des tunnels** : Les tunnels ne se recréent que si nécessaire
2. **Cache des URLs** : URLs sauvegardées localement
3. **Monitoring actif** : Vérification automatique de l'état des tunnels

### Limites Ngrok

- **Gratuit** : 1 tunnel concurrent, URLs aléatoires
- **Payant** : Tunnels multiples, domaines personnalisés, auth

Cette solution vous permet d'avoir un développement et un déploiement entièrement automatisés avec des URLs publiques qui se mettent à jour automatiquement ! 🚀
