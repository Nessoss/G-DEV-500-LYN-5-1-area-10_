#!/bin/bash

# Script d'arrêt pour l'application AREA
echo "🛑 Arrêt de l'application AREA..."

PROJECT_DIR="/home/philou/tek/tek3/G-DEV-500-LYN-5-1-area-10"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Arrêter les tunnels ngrok
stop_ngrok() {
    log_info "Arrêt des tunnels ngrok..."
    
    # Tuer tous les processus ngrok
    pkill -f ngrok || true
    
    # Supprimer les fichiers PID
    rm -f "$PROJECT_DIR/ngrok-backend.pid"
    rm -f "$PROJECT_DIR/ngrok-frontend.pid"
    rm -f "$PROJECT_DIR/ngrok-backend.log"
    rm -f "$PROJECT_DIR/ngrok-frontend.log"
    rm -f "$PROJECT_DIR/tunnel-urls.env"
    
    log_success "Tunnels ngrok arrêtés"
}

# Arrêter Docker
stop_docker() {
    log_info "Arrêt des services Docker..."
    cd "$PROJECT_DIR"
    
    docker-compose down --remove-orphans
    
    if [ $? -eq 0 ]; then
        log_success "Services Docker arrêtés"
    else
        log_warning "Problème lors de l'arrêt des services Docker"
    fi
}

# Nettoyer les ports
clean_ports() {
    log_info "Nettoyage des ports..."
    
    # Ports à nettoyer
    ports=(8080 8081 4040 5433 5050)
    
    for port in "${ports[@]}"; do
        pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            log_info "Nettoyage du port $port..."
            echo $pids | xargs kill -9 2>/dev/null || true
        fi
    done
    
    log_success "Ports nettoyés"
}

# Fonction principale
main() {
    log_info "=== ARRÊT DE L'APPLICATION AREA ==="
    
    # Arrêter ngrok
    stop_ngrok
    
    # Arrêter Docker
    stop_docker
    
    # Nettoyer les ports
    clean_ports
    
    log_success "=== APPLICATION ARRÊTÉE ==="
}

# Exécuter le script principal
main
