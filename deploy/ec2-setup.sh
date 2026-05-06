#!/usr/bin/env bash
# ============================================================
# WebJuanma EC2 bootstrap (Amazon Linux 2023, t3.nano or larger)
#
# Idempotent: safe to re-run.
#
# Usage (as root):
#   sudo bash ec2-setup.sh
# ============================================================
set -euo pipefail

USER_NAME=${USER_NAME:-ec2-user}
APP_DIR=/opt/webjuanma
DATA_DIR=/var/lib/webjuanma/data
ENV_DIR=/etc/webjuanma
COMPOSE_VERSION=v2.32.4

echo "==> System update"
dnf -y update

echo "==> Installing Docker"
dnf install -y docker
systemctl enable --now docker
usermod -aG docker "$USER_NAME"

echo "==> Installing Docker Compose v2 plugin"
DOCKER_CONFIG=/usr/local/lib/docker
mkdir -p "$DOCKER_CONFIG/cli-plugins"
ARCH=$(uname -m)
case "$ARCH" in
    x86_64)  COMPOSE_ARCH=x86_64 ;;
    aarch64) COMPOSE_ARCH=aarch64 ;;
    *) echo "Unsupported arch: $ARCH"; exit 1 ;;
esac
curl -fsSL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-${COMPOSE_ARCH}" \
    -o "$DOCKER_CONFIG/cli-plugins/docker-compose"
chmod +x "$DOCKER_CONFIG/cli-plugins/docker-compose"

echo "==> Creating directories"
install -d -o "$USER_NAME" -g "$USER_NAME" -m 755 "$APP_DIR"
install -d -o 1000        -g 1000        -m 755 "$DATA_DIR"
install -d -o root        -g root        -m 700 "$ENV_DIR"

echo "==> Installing log rotation for the daemon"
cat > /etc/docker/daemon.json <<'JSON'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
JSON
systemctl restart docker

cat <<'EOF'

============================================================
  Setup complete. Manual steps that follow:
============================================================

 1) Backend secrets — never enter the image:
        sudo install -m 600 /dev/null /etc/webjuanma/backend.env
        sudoedit /etc/webjuanma/backend.env
    Required keys:
        SMTP_HOST=smtp.gmail.com
        SMTP_PORT=587
        SMTP_USER=...@gmail.com
        SMTP_PASS=...               # Gmail App Password
        CONTACT_TO_EMAIL=...

 2) Cloudflare Tunnel — go to:
        https://one.dash.cloudflare.com/  → Networks → Tunnels → Create
    Pick "Docker", copy the long token from the suggested command,
    keep it for step 4. In the same wizard add a public hostname:
        webjuanma.com  →  HTTP  →  frontend:3000

 3) Compose stack:
        sudo cp /path/to/repo/docker-compose.yml         /opt/webjuanma/
        sudo cp /path/to/repo/compose.env.example        /opt/webjuanma/.env
        sudo cp /path/to/repo/deploy/deploy.sh           /opt/webjuanma/
        sudo chmod +x /opt/webjuanma/deploy.sh
        sudoedit /opt/webjuanma/.env       # fill in GHCR_OWNER, CLOUDFLARED_TOKEN, etc.

 4) Login to ghcr.io (use a GitHub PAT with read:packages):
        echo "<PAT>" | docker login ghcr.io -u <github-user> --password-stdin

 5) Pull and bring it up:
        cd /opt/webjuanma
        bash deploy.sh

 6) Tail logs:
        docker compose logs -f
============================================================
EOF
