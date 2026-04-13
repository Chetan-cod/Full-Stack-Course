#!/usr/bin/env bash
set -euo pipefail

sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker "$USER"

echo "1. Update deploy/ec2/docker-compose.prod.yml or export GHCR_IMAGE"
echo "2. Authenticate to ghcr.io:"
echo "   echo <GITHUB_TOKEN> | docker login ghcr.io -u <GITHUB_USER> --password-stdin"
echo "3. Run:"
echo "   docker compose -f deploy/ec2/docker-compose.prod.yml pull"
echo "   docker compose -f deploy/ec2/docker-compose.prod.yml up -d"

