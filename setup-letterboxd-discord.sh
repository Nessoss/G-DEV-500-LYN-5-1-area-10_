#!/bin/bash

# Script pour configurer une AREA Letterboxd -> Discord
# Usage: ./setup-letterboxd-discord.sh <DISCORD_WEBHOOK_URL> [LETTERBOXD_USERNAME]

set -e

DISCORD_WEBHOOK_URL="${1}"
LETTERBOXD_USERNAME="${2:-alness}"
BASE_URL="http://localhost:8080"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Configuration AREA Letterboxd -> Discord${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Vérification des paramètres
if [ -z "$DISCORD_WEBHOOK_URL" ]; then
    echo -e "${RED}❌ Erreur: URL du webhook Discord requise${NC}"
    echo ""
    echo "Usage: $0 <DISCORD_WEBHOOK_URL> [LETTERBOXD_USERNAME]"
    echo ""
    echo "Pour créer un webhook Discord:"
    echo "1. Allez dans les paramètres de votre serveur Discord"
    echo "2. Intégrations -> Webhooks"
    echo "3. Nouveau Webhook"
    echo "4. Copiez l'URL du webhook"
    echo ""
    exit 1
fi

echo -e "${YELLOW}📝 Configuration:${NC}"
echo -e "   Utilisateur Letterboxd: ${GREEN}${LETTERBOXD_USERNAME}${NC}"
echo -e "   Webhook Discord: ${GREEN}${DISCORD_WEBHOOK_URL:0:50}...${NC}"
echo ""

# Étape 1: Créer un compte ou se connecter
echo -e "${BLUE}1️⃣  Connexion au compte...${NC}"

# Vérifier si le fichier de login existe
if [ ! -f /tmp/login.json ]; then
    echo -e "${YELLOW}   Création d'un nouveau compte de test...${NC}"
    cat > /tmp/login.json <<EOF
{
  "email": "test@example.com",
  "password": "TestPass123$"
}
EOF
fi

# Se connecter
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d @/tmp/login.json)

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}   ❌ Échec de la connexion${NC}"
    echo "$LOGIN_RESPONSE" | jq .
    exit 1
fi

echo -e "${GREEN}   ✅ Connecté avec succès${NC}"
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id')
echo -e "   User ID: ${USER_ID}"
echo ""

# Étape 2: Récupérer les services
echo -e "${BLUE}2️⃣  Récupération des services disponibles...${NC}"

SERVICES=$(curl -s -X GET "${BASE_URL}/services" \
    -H "Authorization: Bearer $TOKEN")

LETTERBOXD_SERVICE_ID=$(echo "$SERVICES" | jq -r '.[] | select(.slug == "letterboxd") | .id')

if [ "$LETTERBOXD_SERVICE_ID" == "null" ] || [ -z "$LETTERBOXD_SERVICE_ID" ]; then
    echo -e "${RED}   ❌ Service Letterboxd non trouvé${NC}"
    echo -e "${YELLOW}   Exécution du seed de la base de données...${NC}"
    docker-compose exec server npm run seed
    echo -e "${GREEN}   ✅ Seed terminé, réessayez le script${NC}"
    exit 1
fi

echo -e "${GREEN}   ✅ Service Letterboxd trouvé (ID: ${LETTERBOXD_SERVICE_ID})${NC}"

# Récupérer l'action "new_diary_entry"
ACTION_ID=$(curl -s -X GET "${BASE_URL}/services" \
    -H "Authorization: Bearer $TOKEN" | \
    jq -r ".[] | select(.slug == \"letterboxd\") | .actions[] | select(.key == \"new_diary_entry\") | .id")

# Récupérer la réaction "send_webhook"
REACTION_ID=$(curl -s -X GET "${BASE_URL}/services" \
    -H "Authorization: Bearer $TOKEN" | \
    jq -r ".[] | select(.slug == \"letterboxd\") | .reactions[] | select(.key == \"send_webhook\") | .id")

if [ "$ACTION_ID" == "null" ] || [ -z "$ACTION_ID" ]; then
    echo -e "${RED}   ❌ Action 'new_diary_entry' non trouvée${NC}"
    exit 1
fi

if [ "$REACTION_ID" == "null" ] || [ -z "$REACTION_ID" ]; then
    echo -e "${RED}   ❌ Réaction 'send_webhook' non trouvée${NC}"
    exit 1
fi

echo -e "${GREEN}   ✅ Action ID: ${ACTION_ID}${NC}"
echo -e "${GREEN}   ✅ Réaction ID: ${REACTION_ID}${NC}"
echo ""

# Étape 3: Créer l'AREA
echo -e "${BLUE}3️⃣  Création de l'AREA...${NC}"

# Créer le payload JSON pour l'AREA
AREA_PAYLOAD=$(cat <<EOF
{
  "name": "Letterboxd ${LETTERBOXD_USERNAME} -> Discord",
  "actionId": ${ACTION_ID},
  "reactionId": ${REACTION_ID},
  "enabled": true,
  "actionConfig": {
    "username": "${LETTERBOXD_USERNAME}"
  },
  "reactionConfig": {
    "webhookUrl": "${DISCORD_WEBHOOK_URL}",
    "includeReview": true
  }
}
EOF
)

echo "$AREA_PAYLOAD" | jq . > /tmp/area_payload.json

AREA_RESPONSE=$(curl -s -X POST "${BASE_URL}/areas" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d @/tmp/area_payload.json)

AREA_ID=$(echo "$AREA_RESPONSE" | jq -r '.id')

if [ "$AREA_ID" == "null" ] || [ -z "$AREA_ID" ]; then
    echo -e "${RED}   ❌ Échec de la création de l'AREA${NC}"
    echo "$AREA_RESPONSE" | jq .
    exit 1
fi

echo -e "${GREEN}   ✅ AREA créée avec succès!${NC}"
echo -e "   AREA ID: ${AREA_ID}"
echo ""

# Étape 4: Vérifier l'AREA
echo -e "${BLUE}4️⃣  Vérification de l'AREA...${NC}"

AREA_INFO=$(curl -s -X GET "${BASE_URL}/areas/${AREA_ID}" \
    -H "Authorization: Bearer $TOKEN")

echo "$AREA_INFO" | jq .

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   ✅ Configuration terminée avec succès!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${YELLOW}📋 Résumé:${NC}"
echo -e "   • AREA ID: ${GREEN}${AREA_ID}${NC}"
echo -e "   • Utilisateur Letterboxd: ${GREEN}${LETTERBOXD_USERNAME}${NC}"
echo -e "   • Action: ${GREEN}Nouvelle entrée diary${NC}"
echo -e "   • Réaction: ${GREEN}Webhook Discord${NC}"
echo -e "   • Statut: ${GREEN}Activé${NC}"
echo ""
echo -e "${YELLOW}🔄 Prochaines étapes:${NC}"
echo -e "   1. Le système vérifie le flux RSS toutes les 5 minutes"
echo -e "   2. Pour tester immédiatement, exécutez:"
echo -e "      ${BLUE}curl -X POST ${BASE_URL}/letterboxd/poll -H \"Authorization: Bearer $TOKEN\"${NC}"
echo ""
echo -e "${YELLOW}💡 Conseil:${NC}"
echo -e "   Sauvegardez votre token d'accès pour les futures requêtes:"
echo -e "   ${BLUE}export TOKEN=${TOKEN}${NC}"
echo ""
