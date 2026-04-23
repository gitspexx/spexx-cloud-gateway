#!/usr/bin/env bash
# Deploy the Spexx Cloud Gateway Worker.
#
# Prereqs:
#   1. The three DNS zones (contentko.com, kollably.co, insiderguide.co)
#      must already be on the same Cloudflare account you're logging in to.
#   2. You must have Cloudflare account access that includes Workers.
#
# Usage:
#   ./scripts/deploy.sh              # deploys to production
#   npx wrangler login               # one-time interactive login (if not already)
#
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found. Install Node.js first."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Type-checking..."
npx tsc --noEmit

echo "Deploying Worker..."
npx wrangler deploy

echo
echo "Done. Custom domains provisioned:"
echo "  https://api.contentko.com"
echo "  https://api.kollably.co"
echo "  https://api.insiderguide.co"
echo
echo "Smoke test:"
echo "  curl -sS https://api.contentko.com/functions/v1/ -i | head -5"
