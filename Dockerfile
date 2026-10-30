# Deploiement Railway : sert le site statique tel quel avec Caddy.
FROM caddy:2.8.4-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv
RUN rm -rf /srv/.git /srv/Dockerfile /srv/Caddyfile /srv/.dockerignore
