# Deployment guide

## Setup your database

The database tech used into the project is `Postgres` version 17
After the setup of your database copy the url string

## Setup the env variables

Into your server configuration setup these env config

```env
DATABASE_URL="postgresql://admin:admin1234@localhost:5455/issgeo_db?schema=public&connection_limit=5"
JWT_SECRET="your_jwt_secret_key_here"
ADMIN_PASSWORD="your_admin_password_here"
```

## Deployment script

The project containerized with docker all you need to deploy is an service supporting this stack then follow the setup guide and then deploy the server

> Be sure to select Docker like your stack during the setup
