#!/bin/bash
# Polymarket Arbitrage Service - Build & Test Script
# Run from: /home/north/.openclaw/workspace
set -e # Exit on error

echo "🚀 Step 1: Building Docker image..."
cd /home/north/.openclaw/workspace/services/polymarket-arb

# Build the image
docker build -t brandontech/polymarket-arb:latest .

echo "✅ Docker image built successfully!"

echo ""
echo "📋 Next steps:"
echo "1. Get your API keys ready:"
echo " - POLYMARKET_API_KEY"
echo " - ALPACA_API_KEY"
echo " - ALPACA_SECRET_KEY"
echo ""
echo "2. Test the container with:"
echo ""
echo "docker run --rm -e PAPER_TRADING=1 \\"
echo " -e POLYMARKET_API_KEY=<your-key> \\"
echo " -e ALPACA_API_KEY=<your-key> \\"
echo " -e ALPACA_SECRET_KEY=<your-secret> \\"
echo " -p 8000:8000 brandontech/polymarket-arb:latest"
echo ""
echo "3. Verify health endpoint:"
echo " curl http://localhost:8000/health"
echo ""
echo "4. Trigger a test run:"
echo " curl -X POST http://localhost:8000/run"
echo ""
echo "💡 Once tested, run: docker login && docker push brandontech/polymarket-arb:latest"
