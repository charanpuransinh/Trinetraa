# ─────────────────────────────────────────────────────────────
#  TRISHUL PRO — Production Dockerfile
#  Serves all static HTML dashboards via Nginx
#  Author: Aruna | Project: Trishul Pro Master
# ─────────────────────────────────────────────────────────────

FROM nginx:1.27-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy all project HTML files into nginx web root
COPY . /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check — ensures container is serving
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

# Nginx runs in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
