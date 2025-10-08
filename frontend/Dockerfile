# Étape 1 : build
FROM node:20-alpine AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de config et installer les dépendances
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

# Copier tout le code
COPY . .

# Construire l’app pour la prod
RUN npm run build

# Étape 2 : image finale (plus légère)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copier uniquement les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
