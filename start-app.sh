#!/bin/bash

# Script de démarrage automatisé avec tunnels
echo "🚀 Démarrage automatisé de l'application AREA..."

# Variables
PROJECT_DIR="/home/philou/tek/tek3/G-DEV-500-LYN-5-1-area-10"
NGROK_PATH="$PROJECT_DIR/ngrok"
BACKEND_PORT=8080
FRONTEND_PORT=8081

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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour vérifier si un port est occupé
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port occupé
    else
        return 1  # Port libre
    fi
}

# Fonction pour tuer les processus sur un port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port)
    if [ ! -z "$pids" ]; then
        log_warning "Arrêt des processus sur le port $port..."
        echo $pids | xargs kill -9
        sleep 2
    fi
}

# Fonction pour extraire ngrok si nécessaire
setup_ngrok() {
    if [ ! -f "$NGROK_PATH" ]; then
        if [ -f "$PROJECT_DIR/ngrok-v3-stable-linux-amd64.tgz" ]; then
            log_info "Extraction de ngrok..."
            cd "$PROJECT_DIR"
            tar -xzf ngrok-v3-stable-linux-amd64.tgz
            chmod +x ngrok
            log_success "Ngrok extrait avec succès"
        else
            log_error "Archive ngrok non trouvée!"
            exit 1
        fi
    fi
}

# Fonction pour démarrer ngrok
start_ngrok() {
    log_info "Démarrage des tunnels ngrok..."
    
    # Arrêter ngrok existant
    pkill -f ngrok || true
    sleep 2
    
    # Démarrer les tunnels
    nohup $NGROK_PATH http $BACKEND_PORT --log=stdout > "$PROJECT_DIR/ngrok-backend.log" 2>&1 &
    NGROK_BACKEND_PID=$!
    
    nohup $NGROK_PATH http $FRONTEND_PORT --log=stdout > "$PROJECT_DIR/ngrok-frontend.log" 2>&1 &
    NGROK_FRONTEND_PID=$!
    
    sleep 5
    
    # Vérifier que ngrok fonctionne
    if ps -p $NGROK_BACKEND_PID > /dev/null && ps -p $NGROK_FRONTEND_PID > /dev/null; then
        log_success "Tunnels ngrok démarrés (PIDs: $NGROK_BACKEND_PID, $NGROK_FRONTEND_PID)"
        
        # Sauvegarder les PIDs
        echo $NGROK_BACKEND_PID > "$PROJECT_DIR/ngrok-backend.pid"
        echo $NGROK_FRONTEND_PID > "$PROJECT_DIR/ngrok-frontend.pid"
        
        return 0
    else
        log_error "Échec du démarrage des tunnels ngrok"
        return 1
    fi
}

# Fonction pour obtenir les URLs ngrok
get_ngrok_urls() {
    sleep 3
    log_info "Récupération des URLs ngrok..."
    
    # Attendre que l'API ngrok soit disponible
    local attempts=0
    while [ $attempts -lt 10 ]; do
        if curl -s http://localhost:4040/api/tunnels >/dev/null 2>&1; then
            break
        fi
        attempts=$((attempts + 1))
        sleep 1
    done
    
    # Récupérer les URLs
    local urls=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | "\(.name): \(.public_url)"' 2>/dev/null)
    
    if [ ! -z "$urls" ]; then
        log_success "URLs des tunnels:"
        echo "$urls"
        
        # Extraire les URLs spécifiques
        BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.config.addr | contains("8080")) | .public_url' 2>/dev/null)
        FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.config.addr | contains("8081")) | .public_url' 2>/dev/null)
        
        log_info "Backend URL: $BACKEND_URL"
        log_info "Frontend URL: $FRONTEND_URL"
        
        # Sauvegarder les URLs
        echo "BACKEND_URL=$BACKEND_URL" > "$PROJECT_DIR/tunnel-urls.env"
        echo "FRONTEND_URL=$FRONTEND_URL" >> "$PROJECT_DIR/tunnel-urls.env"
        
        return 0
    else
        log_warning "Impossible de récupérer les URLs ngrok"
        return 1
    fi
}

# Fonction pour démarrer Docker
start_docker() {
    log_info "Démarrage des services Docker..."
    cd "$PROJECT_DIR"
    
    # Arrêter les services existants
    docker-compose down --remove-orphans
    
    # Démarrer les services
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        log_success "Services Docker démarrés"
        return 0
    else
        log_error "Échec du démarrage des services Docker"
        return 1
    fi
}

# Fonction pour attendre que les services soient prêts
wait_for_services() {
    log_info "Attente que les services soient prêts..."
    
    # Attendre le backend
    local attempts=0
    while [ $attempts -lt 30 ]; do
        if curl -s http://localhost:$BACKEND_PORT/about.json >/dev/null 2>&1; then
            log_success "Backend prêt sur le port $BACKEND_PORT"
            break
        fi
        attempts=$((attempts + 1))
        sleep 2
    done
    
    # Attendre le frontend
    attempts=0
    while [ $attempts -lt 30 ]; do
        if curl -s http://localhost:$FRONTEND_PORT >/dev/null 2>&1; then
            log_success "Frontend prêt sur le port $FRONTEND_PORT"
            break
        fi
        attempts=$((attempts + 1))
        sleep 2
    done
}

# Fonction pour créer un service systemd (optionnel)
create_systemd_service() {
    if [ "$1" = "--install-service" ]; then
        log_info "Création du service systemd..."
        
        cat > /tmp/area-app.service << EOF
[Unit]
Description=AREA Application with Auto Tunnels
After=network.target docker.service
Requires=docker.service

[Service]
Type=forking
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=$PROJECT_DIR/start-app.sh
ExecStop=$PROJECT_DIR/stop-app.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        
        sudo mv /tmp/area-app.service /etc/systemd/system/
        sudo systemctl daemon-reload
        sudo systemctl enable area-app.service
        
        log_success "Service systemd créé. Utilisez 'sudo systemctl start area-app' pour démarrer"
    fi
}

# Fonction principale
main() {
    log_info "=== DÉMARRAGE AUTOMATISÉ AREA ==="
    
    # Vérifier les dépendances
    command -v docker >/dev/null 2>&1 || { log_error "Docker n'est pas installé"; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "Docker Compose n'est pas installé"; exit 1; }
    
    # Nettoyer les ports si nécessaire
    if check_port $BACKEND_PORT; then
        log_warning "Port $BACKEND_PORT occupé, nettoyage..."
        kill_port $BACKEND_PORT
    fi
    
    if check_port $FRONTEND_PORT; then
        log_warning "Port $FRONTEND_PORT occupé, nettoyage..."
        kill_port $FRONTEND_PORT
    fi
    
    # Configuration ngrok
    setup_ngrok
    
    # Démarrer Docker en premier
    if ! start_docker; then
        log_error "Impossible de démarrer les services Docker"
        exit 1
    fi
    
    # Attendre que les services soient prêts
    wait_for_services
    
    # Démarrer ngrok
    if start_ngrok; then
        # Obtenir les URLs
        if get_ngrok_urls; then
            log_success "=== APPLICATION DÉMARRÉE AVEC SUCCÈS ==="
            log_info "Backend local: http://localhost:$BACKEND_PORT"
            log_info "Frontend local: http://localhost:$FRONTEND_PORT"
            log_info "Backend public: $BACKEND_URL"
            log_info "Frontend public: $FRONTEND_URL"
            log_info "Ngrok dashboard: http://localhost:4040"
        else
            log_warning "Application démarrée mais URLs ngrok non disponibles"
        fi
    else
        log_warning "Application démarrée sans tunnels ngrok"
    fi
    
    # Créer le service systemd si demandé
    create_systemd_service "$1"
    
    log_success "=== DÉMARRAGE TERMINÉ ==="
}

# Exécuter le script principal
main "$@"
