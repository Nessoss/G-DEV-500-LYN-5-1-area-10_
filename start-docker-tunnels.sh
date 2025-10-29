#!/bin/bash

# Script de démarrage simplifié pour Docker
echo "🚀 Démarrage rapide avec Docker et tunnels automatiques..."

# Variables
PROJECT_DIR="/home/philou/tek/tek3/G-DEV-500-LYN-5-1-area-10"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

main() {
    log_info "=== DÉMARRAGE DOCKER AVEC TUNNELS ==="
    
    cd "$PROJECT_DIR"
    
    # Activer les tunnels dans Docker
    export ENABLE_TUNNELS=true
    
    # Démarrer avec docker-compose
    log_info "Démarrage des services Docker avec tunnels..."
    docker-compose down --remove-orphans
    docker-compose up -d
    
    log_success "Services démarrés!"
    log_info "Backend: http://localhost:8080"
    log_info "Frontend: http://localhost:8081" 
    log_info "Ngrok Dashboard: http://localhost:4040"
    
    # Attendre et afficher les URLs des tunnels
    sleep 10
    log_info "Récupération des URLs des tunnels..."
    
    if curl -s http://localhost:4040/api/tunnels >/dev/null 2>&1; then
        curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | "\(.name): \(.public_url)"' 2>/dev/null || echo "URLs disponibles sur http://localhost:4040"
    else
        log_info "Dashboard ngrok: http://localhost:4040"
    fi
}

main "$@"
