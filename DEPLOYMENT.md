# Guide de déploiement

## Prérequis

- [Bun](https://bun.sh) (runtime JavaScript)
- [Docker](https://www.docker.com/) et Docker Compose
- [PostgreSQL](https://www.postgresql.org/) version 17 (si déploiement sans Docker)

---

## Configuration de la base de données

### Option 1 : Docker Compose (recommandé)

Le projet inclut un fichier `compose.yaml` qui configure à la fois la base de données et le serveur.

```bash
# Démarrer tous les services (base de données + serveur)
docker compose up -d

# Ou séparément
docker compose up issgeo_db -d  # Base de données uniquement
docker compose up server -d     # Serveur uniquement
```

Les variables d'environnement sont déjà configurées dans `compose.yaml` :
- `POSTGRES_USER`: admin
- `POSTGRES_PASSWORD`: admin1234
- `POSTGRES_DB`: issgeo_db
- Port exposé : 5455

### Option 2 : Base de données gérée (Railway, Supabase, Neon, etc.)

Pour les services cloud gérés, créez une base de données PostgreSQL 17 et récupérez l'URL de connexion.

**Services recommandés :**

| Service | Tier gratuit | URL de connexion |
|---------|--------------|------------------|
| [Supabase](https://supabase.com) | 500 MB | `postgresql://user:password@host:5432/db` |
| [Neon](https://neon.tech) | 512 MB | Idem PostgreSQL standard |
| [Railway](https://railway.app) | 500 MB | Variable `DATABASE_URL` PROVIDED |
| [PlanetScale](https://planetscale.com) | 1 GB | Non compatible (MySQL) |
| [CockroachDB](https://cockroachlabs.com) | 5 GB | Format PostgreSQL |

### Option 3 : PostgreSQL local

```bash
# Installation sur Ubuntu/Debian
sudo apt update
sudo apt install postgresql-17

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres createuser -s admin
sudo -u postgres createdb issgeo_db
sudo -u postgres psql -c "ALTER USER admin WITH PASSWORD 'admin1234'"
```

---

## Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de connexion à la base de données
# Format: postgresql://user:password@host:port/database?schema=public&connection_limit=5
DATABASE_URL="postgresql://admin:admin1234@localhost:5455/issgeo_db?schema=public&connection_limit=5"

# Clé secrète pour la génération des tokens JWT
# Générez une clé aléatoire sécurisée avec: openssl rand -base64 32
JWT_SECRET="votre_cle_secrete_jwt_ici"

# Mot de passe pour l'accès administrateur
ADMIN_PASSWORD="votre_mot_de_passe_admin"
```

### Description des variables

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL | Oui |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT (minimum 32 caractères) | Oui |
| `ADMIN_PASSWORD` | Mot de passe du compte administrateur | Oui |

---

## Méthodes de déploiement

### Méthode 1 : Docker Compose (le plus simple)

```bash
# 1. Configuration
cp .env.example .env
# Modifiez .env avec vos valeurs

# 2. Construction et démarrage
docker compose up -d --build

# 3. Vérification
docker compose logs -f server
```

Le serveur sera accessible sur `http://localhost:3000`

### Méthode 2 : Docker seul (sans compose)

```bash
# 1. Construire l'image
docker build -t issgeo .

# 2. Lancer le conteneur
docker run -d \
  --name issgeo \
  -p 3000:3000 \
  -e DATABASE_URL="votre_url" \
  -e JWT_SECRET="votre_secret" \
  -e ADMIN_PASSWORD="votre_mdp" \
  issgeo
```

### Méthode 3 : Bare metal (sans Docker)

```bash
# 1. Installer les dépendances
bun install

# 2. Configuration
cp .env.example .env
# Modifiez .env avec vos valeurs

# 3. Appliquer les migrations
bun run migrate:db

# 4. Semer la base de données (optionnel)
bun run seed:db

# 5. Démarrer le serveur
bun run start
```

### Méthode 4 : Service de déploiement (Railway, Render, Fly.io)

**Railway :**
1. Connecter le dépôt GitHub
2. Ajouter la variable `DATABASE_URL` (depuis Railway PostgreSQL)
3. Ajouter `JWT_SECRET` et `ADMIN_PASSWORD`
4. Le build se fait automatiquement via le `Dockerfile`

**Render :**
1. Créer un nouveau service "Web Service"
2. Connecter le dépôt
3. Configurer :
   - Build Command: `bun run build`
   - Start Command: `bun run start`
4. Ajouter les variables d'environnement

**Fly.io :**
```bash
# 1. Installer flyctl
brew install flyctl

# 2. Lancer l'application
fly launch

# 3. Configurer les variables
fly secrets set DATABASE_URL="..."
fly secrets set JWT_SECRET="..."
fly secrets set ADMIN_PASSWORD="..."

# 4. Déployer
fly deploy
```

---

## Scripts disponibles

```bash
bun run dev           # Développement avec hot-reload
bun run build        # Construction client + serveur
bun run start       # Production (migrate + seed + start)
bun run migrate:db  # Appliquer les migrations
bun run seed:db     # Semer la base de données
bun run wake:db     # Démarrer la base de données Docker
bun run down:db     # Arrêter la base de données Docker
bun run purge:db    # Supprimer les données Docker
bun run init:all    # Initialisation complète
```

---

## Dépannage

### Erreur de connexion à la base de données

Vérifiez que la base de données est démarrée et que l'URL est correcte :

```bash
# Tester la connexion
docker compose exec issgeo_db pg_isready -U admin

# Voir les logs
docker compose logs issgeo_db
```

### Erreur de permission

Si vous avez des erreurs de permission sur les volumes Docker :

```bash
# Corriger les permissions
sudo chown -R 1000:1000 ./volumes
```

### Ports déjà utilisés

Le serveur utilise le port 3000. Pour le changer :

```bash
# Via Docker
docker run -p 8080:3000 ...

# Via variable d'environnement (non supporté actuellement)
```

---

## Production

Pour un déploiement en production :

1. **Sécurisez les variables d'environnement** : Utilisez un gestionnaire de secrets
2. **Configurez HTTPS** : Via un reverse proxy (nginx, Caddy, Cloudflare)
3. **Activez les sauvegardes** : Pour la base de données
4. **Configurez les logs** : Rotation des logs Docker
5. **Surveillez l'application** : Health checks inclus dans `compose.yaml`

### Exemple avec nginx

```nginx
server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```