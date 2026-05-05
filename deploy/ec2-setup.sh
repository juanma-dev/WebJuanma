#!/bin/bash
# ============================================================
# WebJuanma — EC2 Setup Script (t3.nano / Amazon Linux 2023)
# Run as root: sudo bash ec2-setup.sh
# ============================================================

set -euo pipefail

DOMAIN="webjuanma.com"
EMAIL="websjuanma@gmail.com"
APP_DIR="/var/www/webjuanma.com"
BACKEND_DIR="/opt/webjuanma-api"

echo "=========================================="
echo "  WebJuanma EC2 Setup"
echo "=========================================="

# 1. System updates
echo "📦 Updating system..."
dnf update -y
dnf install -y nginx certbot python3-certbot-nginx git unzip

# 2. Create directories
echo "📂 Creating directories..."
mkdir -p "$APP_DIR/frontend"
mkdir -p "$BACKEND_DIR"

# 3. Setup Nginx
echo "🔧 Configuring Nginx..."
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup 2>/dev/null || true

# Copy the site config
cat > /etc/nginx/conf.d/webjuanma.conf << 'NGINX_CONF'
server {
    listen 80;
    server_name webjuanma.com www.webjuanma.com;

    # Let Certbot handle the redirect after SSL is set up
    root /var/www/webjuanma.com/frontend;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Static assets
    location /_next/static/ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_CONF

# Test and start Nginx
nginx -t
systemctl enable nginx
systemctl start nginx

# 4. SSL with Certbot
echo "🔒 Setting up SSL..."
echo "⚠️  Make sure DNS A record for $DOMAIN points to this server's IP first!"
echo "    Then run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email"
echo ""

# 5. Backend systemd service
echo "⚙️ Creating backend service..."
cat > /etc/systemd/system/webjuanma-api.service << EOF
[Unit]
Description=WebJuanma API (Rust Axum)
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=$BACKEND_DIR
ExecStart=$BACKEND_DIR/webjuanma-api
Restart=always
RestartSec=5
Environment=RUST_LOG=webjuanma_api=info,tower_http=info
EnvironmentFile=$BACKEND_DIR/.env

# Resource limits (optimized for t3.nano)
MemoryMax=64M
CPUQuota=50%

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable webjuanma-api

# 6. Firewall
echo "🔥 Configuring firewall..."
# AWS Security Group should allow: 22 (SSH), 80 (HTTP), 443 (HTTPS)

echo ""
echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Upload frontend build:    scp -r out/* ec2-user@IP:$APP_DIR/frontend/"
echo "  2. Upload backend binary:    scp target/release/webjuanma-api ec2-user@IP:$BACKEND_DIR/"
echo "  3. Upload backend .env:      scp .env ec2-user@IP:$BACKEND_DIR/"
echo "  4. Start backend:            sudo systemctl start webjuanma-api"
echo "  5. Point DNS A record to this IP"
echo "  6. Setup SSL:                sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
