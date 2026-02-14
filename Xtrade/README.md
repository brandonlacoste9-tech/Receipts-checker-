# Polymarket Arbitrage Service

A containerised pipeline that ingests tweets, runs sentiment analysis (Ollama or external LLM), generates Polymarket signals, and optionally executes trades via Alpaca. See [APP.md](APP.md) for the full overview.

## Quick Start

```bash
chmod +x 01-build-and-test.sh 03-helm-deploy.sh
./01-build-and-test.sh
# Edit 02-k8s-secrets.yaml (replace <your-*> placeholders)
kubectl apply -f 02-k8s-secrets.yaml
./03-helm-deploy.sh
```

## Deployment

### 1. Build & Test Locally

```bash
./01-build-and-test.sh
```

### 2. Kubernetes Secrets

Edit `02-k8s-secrets.yaml` and replace all `<your-*>` placeholders. Ensure `stripe-secret` includes both `STRIPE_WEBHOOK_SECRET` and `STRIPE_SECRET_KEY` (required for the revenue tracker).

```bash
kubectl apply -f 02-k8s-secrets.yaml
```

### 3. Helm Deploy

```bash
./03-helm-deploy.sh
```

### 4. (Optional) Ingress for Stripe Webhook

Edit `04-stripe-ingress.yaml`, replace `YOUR-DOMAIN`, then:

```bash
kubectl apply -f 04-stripe-ingress.yaml
```

Add `https://arb.YOUR-DOMAIN.com/stripe/webhook` in the Stripe Dashboard.

---

## Persistent Ollama Model Cache

The Helm chart provisions a 5 Gi PVC (`ollama-models-pvc`) mounted at `/root/.ollama` in both the Polymarket container and the Ollama sidecar. This keeps the model cached across pod restarts and avoids re-downloading on each deploy.

---

## Revenue-Tracker CronJob

A Kubernetes CronJob (`revenue-tracker`) runs `revenue/tracker.py` every 15 minutes. It sums recent Stripe payment intents and, when the total exceeds `REVENUE_TARGET_CENTS` (default $500), updates the secret `revenue-switch` with `SWITCH_TO_EXTERNAL=1`. Wire your deployment to read that secret and set `USE_EXTERNAL_LLM=1` in Helm values to switch to the external LLM once revenue targets are met.

---

## Verify

```bash
kubectl -n arbitrage get pods
kubectl -n arbitrage port-forward svc/polymarket-arb 8000:8000
curl http://localhost:8000/health
```

---

## Deploy everything (YOLO mode)

```bash
# 1. Build, test & push (Docker must be logged in)
chmod +x 01-build-and-test.sh 03-helm-deploy.sh
./01-build-and-test.sh

# 2. Edit secrets (replace <…> placeholders)
nano 02-k8s-secrets.yaml
kubectl apply -f 02-k8s-secrets.yaml

# 3. Deploy Helm (includes PVC, HPA, Prometheus, CronJob)
./03-helm-deploy.sh

# 4. (Optional) Expose publicly
nano 04-stripe-ingress.yaml   # set YOUR-DOMAIN
kubectl apply -f 04-stripe-ingress.yaml
```

- **PVC size** – change in `helm/openclaw/values.yaml` → `pvc.size`
- **Prometheus metrics** – available at `http://<svc>:8000/metrics`
- **Autoscaling** – up to 5 pods when CPU > 80%
- **Revenue-tracker** – flips to external LLM when Stripe revenue exceeds `REVENUE_TARGET_CENTS`
- **CI/CD** – runs on each push to `main` (see `.github/workflows/ci.yml`)

**GitHub secrets for CI/CD:** `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `KUBE_CONFIG`
