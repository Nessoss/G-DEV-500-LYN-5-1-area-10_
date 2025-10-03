# Étape 1 : build
FROM node:20-alpine AS builder

# Dossier de travail
WORKDIR /app

# Copier les fichiers de config et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste du projet
COPY . .

# Compiler le code TypeScript en JavaScript
RUN npm run build

# Étape 2 : image finale (plus légère)
FROM node:20-alpine AS runner

# Installer netcat pour vérifier la connexion DB
RUN apk add --no-cache netcat-openbsd

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copier uniquement ce qui est nécessaire pour exécuter l'app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copier le script de démarrage
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]
