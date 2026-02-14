#!/bin/bash
# Polymarket Arbitrage Service - Helm Deployment Script
# Prerequisites: Docker image pushed to brandontech/polymarket-arb:latest
# Kubernetes secrets applied (02-k8s-secrets.yaml)

set -e

echo "🚀 Deploying Polymarket Arbitrage Service via Helm..."
echo ""

# Navigate to helm chart directory
cd /home/north/.openclaw/workspace/helm/openclaw

# Update values.yaml with the correct image repository
echo "🔧 Updating image repository in values.yaml..."
sed -i 's|repository:.*|repository: brandontech/polymarket-arb|' values.yaml
sed -i 's|tag:.*|tag: latest|' values.yaml
echo "✅ values.yaml updated"
echo ""

# Apply secrets first
echo "🔐 Applying Kubernetes secrets..."
kubectl apply -f /home/north/.openclaw/workspace/02-k8s-secrets.yaml
echo "✅ Secrets applied"
echo ""

# Deploy with Helm
echo "📦 Installing/Upgrading Helm release..."
helm upgrade --install polymarket-arb . \
  --namespace arbitrage \
  --create-namespace \
  --wait \
  --timeout 5m
echo "✅ Helm deployment complete!"
echo ""

# Verify deployment
echo "🔍 Verifying deployment..."
kubectl -n arbitrage get pods
kubectl -n arbitrage get svc
echo ""

echo "🎉 Deployment successful!"
echo ""
echo "📝 Next steps:"
echo "1. Check pod logs: kubectl -n arbitrage logs -f <pod-name>"
echo "2. Port-forward to test: kubectl -n arbitrage port-forward svc/polymarket-arb 8000:8000"
echo "3. Test health: curl http://localhost:8000/health"
echo "4. Configure Ingress for public access (optional)"
