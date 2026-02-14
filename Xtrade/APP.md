# Polymarket Arbitrage Service

**App Name:** `polymarket-arb`

## Purpose
A pure‑backend, containerised pipeline that:

1. **Ingests recent tweets** (Twitter API, async, rate‑limited).  
2. **Performs sentiment analysis** – by default using a local Ollama model (`phi3:mini`), with an optional fallback to an external LLM (OpenAI or DeepSeek).  
3. **Generates Polymarket trade signals** – edge gating, Kelly‑sized position sizing, bankroll caps, optional stop‑loss / take‑profit.  
4. **Executes trades** – paper‑trading by default (`PAPER_TRADING=1`), but can place live Alpaca orders when the flag is turned off.  
5. **Exposes a FastAPI HTTP API** (`/health`, `/run`, `/signal`) for SaaS consumption.  
6. **Integrates Stripe** – a webhook creates per‑customer API keys, enabling a pay‑per‑use or subscription model.  
7. **Tracks revenue** – a small Python script (`revenue/tracker.py`) watches Stripe payouts and flips a Kubernetes secret to switch from Ollama to the external LLM once a revenue target is reached.

## Architecture Diagram
```
+------------------+      +-------------------+      +-------------------+
|  Twitter API     | ---> | Sentiment Engine  | ---> | Signal Engine     |
+------------------+      +-------------------+      +-------------------+
                               |                     |
                               v                     v
                     +-------------------+   +-------------------+
                     |   Ollama (or      |   |   External LLM    |
                     |   Local Model)    |   |   (OpenAI/DeepSeek)|
                     +-------------------+   +-------------------+
                               |
                               v
                    +-------------------+   +-------------------+
                    |   Trade Executor  |   |   Paper Trade DB |
                    +-------------------+   +-------------------+
                               |
                               v
                     +-------------------+
                     |   FastAPI HTTP   |
                     +-------------------+
                               |
                               v
               +-------------------+   +-------------------+
               |   Stripe Webhook  |   |   Revenue Tracker |
               +-------------------+   +-------------------+
```

## Key Source Files
| File | Role |
|------|------|
| `services/polymarket-arb/api.py` | FastAPI endpoints (`/health`, `/run`, `/signal`). |
| `services/polymarket-arb/sentiment_engine.py` | Calls Ollama or external LLM, returns sentiment scores in `[-1, 1]`. |
| `services/polymarket-arb/signal_logic.py` | Edge gating, Kelly sizing, bankroll caps, signal JSON construction. |
| `services/polymarket-arb/twitter_scanner.py` | Async recent‑search, rate‑limited, freshness filtering. |
| `helm/openclaw/templates/deployment.yaml` | K8s Deployment – includes Polymarket container + Ollama side‑car. |
| `deploy_all.sh` | One‑click script: build, push, create secrets, Helm install/upgrade. |
| `revenue/tracker.py` | Sums Stripe checkout totals, flips `SWITCH_TO_EXTERNAL=1` when target met. |
| `README.md` | Quick‑start guide (what you already have). |
| `APP.md` | This high‑level project overview. |

---

## Environment / Setup
| Variable | Description | Example |
|----------|-------------|---------|
| `TWITTER_BEARER_TOKEN` | Twitter App‑Only token (mandatory). | `23Drsnqjzclfp7KhlWTNxphaH` |
| `POLYMARKET_API_KEY` | Polymarket API key. | `pk_live_…` |
| `ALPACA_API_KEY` / `ALPACA_SECRET_KEY` | Alpaca paper/live credentials. | `AK…` / `AS…` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret. | `whsec_…` |
| `PAPER_TRADING` | `1` → paper only, `0` → live trades. | `1` |
| `OLLAMA_MODEL` | Name of the local Ollama model. | `phi3:mini` |
| `OLLAMA_ENDPOINT` | URL of the Ollama server (default: `http://127.0.0.1:11434`). | `http://ollama-svc.arbitrage:11434` |
| `USE_EXTERNAL_LLM` | `1` to route sentiment to external LLM, `0` for Ollama. | `0` |
| `EXTERNAL_LLM` | Provider name (`openai` or `deepseek`). | `openai` |
| `EXTERNAL_LLM_API_KEY` | API key for the chosen external provider. | `sk‑…` |
| `REVENUE_TARGET_CENTS` | Revenue threshold at which to switch to external LLM (cents). | `50000` (=$500) |
| `LOOKBACK_DAYS` | How many days of Stripe data to examine. | `30` |

**Local run steps**  
```bash
# 1️⃣ Create a .env file (or export vars)
cp .env.example .env
# edit the .env file and fill the placeholders

# 2️⃣ Build & run locally (Docker must be installed)
./01-build-and-test.sh        # builds the image
docker run --rm -p 8000:8000 \
  -e $(cat .env | xargs) \
  brandontech/polymarket-arb:latest

# 3️⃣ Test the API
curl http://localhost:8000/health
curl -X POST http://localhost:8000/run
```

---

## Data Flow (Step‑by‑Step)

1. **Scheduler / webhook** (e.g., a cron job or manual request) triggers `POST /run`.  
2. `api.py` calls `twitter_scanner.fetch_recent()` → returns a list of tweet dicts (`text`, `author`, `engagement`).  
3. `sentiment_engine.analyze_batch(tweets)` sends each tweet to Ollama (or external LLM) and gets a float score `[-1, 1]`.  
4. `signal_logic.evaluate(scores, tweets)`:
   * Computes edge (`score` × `engagement_cap`).  
   * Checks `MIN_EDGE_PERCENT`.  
   * Applies Kelly fraction (`KELLY_FRACTION`) to compute position size.  
   * Caps position (`MAX_POSITION_PERCENT`) and adds optional stop‑loss / take‑profit.  
   * Returns a JSON signal (`market_id`, `outcome`, `size`, `confidence`).  
5. If `PAPER_TRADING=0` *and* the signal passes all guards, `signal_logic.execute(signal)` sends an order to Alpaca.  
6. The signal (and any paper‑trade audit) is logged to a JSON‑lines file for traceability.  
7. The HTTP response returns the signal (or a "no signal" message) to the caller.  

---

## API Surface

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/health` | Health check – returns `{"status":"ok"}`. | None |
| `POST` | `/run` | Triggers a full pipeline run (tweets → sentiment → signal). Returns `RunResponse` JSON. | Bearer token (API key generated by Stripe webhook) |
| `GET` | `/signal` | Returns the most recent signal cached in‑memory (or 404 if none). | Bearer token |
| `POST` | `/stripe/webhook` | Stripe webhook endpoint – validates signature, creates per‑customer API key. | Stripe signature header |

**RunResponse schema (example)**
```json
{
  "signal": {
    "market_id": "0x1234…",
    "outcome": "YES",
    "size": 0.015,
    "confidence": 0.82,
    "reason": "Twitter sentiment + high engagement"
  },
  "executed": true,
  "reason": null
}
```

---

## Deployment

### Helm (recommended)
```bash
# 1️⃣ Edit helm/openclaw/values.yaml (set image repo, OLLAMA_MODEL, etc.)
# 2️⃣ Run the one‑click script
chmod +x deploy_all.sh
./deploy_all.sh
```

The script will:
1. Build the Docker image.
2. Push it to the registry you configured.
3. Create/update the required Kubernetes secrets (`polymarket-secret`, `alpaca-secret`, `stripe-secret`, `external-llm-secret`).
4. Deploy the Helm chart – which now includes:
   * The **Polymarket container**.
   * An **Ollama side‑car** (`ollama/ollama:0.1.35`) exposing port 11434.
   * A persistent `emptyDir` volume for model caching.
   * Env vars wired from the secrets.

### Ingress & Stripe
If you want a public URL:
```yaml
# 04-stripe-ingress.yaml (already in repo)
# Edit YOUR-DOMAIN and apply:
kubectl apply -f 04-stripe-ingress.yaml
```
Then add the webhook URL `https://<YOUR-DOMAIN>/stripe/webhook` in the Stripe Dashboard.

### Revenue‑Tracker CronJob (optional)
```bash
kubectl apply -f revenue/tracker-cronjob.yaml
```
The CronJob runs `revenue/tracker.py` every 15 min, updates the secret `revenue-switch`, and you can read that secret in your pod (or set `USE_EXTERNAL_LLM=1` manually).

### Scaling & Monitoring
* **Horizontal Pod Autoscaler** – set `replicaCount` in `values.yaml` and enable HPA via a separate manifest.  
* **Prometheus** – enable `prometheus.enabled: true` and add a `/metrics` endpoint in `api.py` (e.g., using `prometheus_client.Counter`).  

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `curl /health` returns 502 | Ollama side‑car not started or crashed | `kubectl logs <pod> -c ollama` → look for "failed to start" messages. Re‑pull the model (`ollama pull phi3:mini`). |
| Sentiment scores always `0.0` | `USE_EXTERNAL_LLM=1` but `EXTERNAL_LLM_API_KEY` missing | Add the key to the `external-llm-secret` or set `USE_EXTERNAL_LLM=0`. |
| Stripe webhook reports 400 signature error | Wrong `STRIPE_WEBHOOK_SECRET` value | Verify the secret from Stripe Dashboard and update the Kubernetes secret. |
| No signal generated even when tweets are positive | `MIN_EDGE_PERCENT` too high or `KELLY_FRACTION` set to 0 | Lower `MIN_EDGE_PERCENT` or increase `KELLY_FRACTION` in `values.yaml`. |
| Pod repeatedly restarts | Image pull error (private registry) | Create a `docker-registry` secret and reference it in the Helm chart (`imagePullSecrets`). |
| Revenue‑tracker never flips the flag | `REVENUE_TARGET_CENTS` too high or wrong Stripe secret | Check Stripe dashboard for actual revenue, adjust the target, and confirm `STRIPE_SECRET_KEY` is set. |

---

## Contributing

1. **Fork** the repository (or clone the workspace).  
2. **Create a feature branch**: `git checkout -b feature/<name>`.  
3. **Run tests**: `pytest services/polymarket-arb/tests`.  
4. **Add/Update documentation** – keep `README.md` and `APP.md` in sync.  
5. **Commit** following the Conventional Commits style (`feat: add X`, `fix: correct Y`).  
6. **Open a Pull Request** – CI will automatically run the test suite and lint checks.  

### Development Tips
* Use **Cursor** (or any IDE) for live linting – missing imports like `httpx` or `openai` will be flagged immediately.  
* The **Helm side‑car** can be tested locally with `kind` or `k3d` – just spin up a cluster, run `./deploy_all.sh`, and port‑forward to verify the API.  
* For rapid iteration on the sentiment engine, you can bypass the Ollama side‑car by setting `USE_EXTERNAL_LLM=1` and pointing `EXTERNAL_LLM_API_KEY` to a cheap test key.

---

## License

MIT License – feel free to fork, modify, and deploy commercially. Just retain the attribution header in source files.

---

*End of APP.md*
