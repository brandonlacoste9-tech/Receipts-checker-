"""
Polymarket Arbitrage Service - FastAPI HTTP API
Endpoints: /health, /run, /signal, /metrics
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from prometheus_client import CONTENT_TYPE_LATEST, Counter, generate_latest
from starlette.responses import Response

# Prometheus counters
REQUESTS_TOTAL = Counter("requests_total", "Total HTTP requests", ["method", "endpoint"])
RUNS_TOTAL = Counter("pipeline_runs_total", "Total pipeline runs executed")
SIGNALS_EMITTED = Counter("signals_emitted_total", "Total trade signals generated")
ERRORS_TOTAL = Counter("errors_total", "Total errors raised")

# In-memory cache for latest signal (optional)
_latest_signal = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown


app = FastAPI(title="Polymarket Arbitrage Service", version="0.1.0", lifespan=lifespan)


@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    REQUESTS_TOTAL.labels(method=request.method, endpoint=request.url.path).inc()
    response = await call_next(request)
    return response


@app.get("/health")
async def health():
    """Health check - returns {"status":"ok"}."""
    return {"status": "ok"}


@app.get("/metrics")
def metrics():
    """Prometheus metrics endpoint."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/run")
async def run_pipeline(request: Request):
    """
    Triggers a full pipeline run (tweets -> sentiment -> signal).
    Returns RunResponse JSON.
    """
    global _latest_signal
    try:
        # TODO: Wire to twitter_scanner, sentiment_engine, signal_logic
        # signal = await run_full_pipeline()
        signal = None
        executed = False

        RUNS_TOTAL.inc()
        if signal:
            SIGNALS_EMITTED.inc()
            _latest_signal = signal

        return {
            "signal": signal,
            "executed": executed,
            "reason": None if signal else "No signal generated",
        }
    except Exception as exc:
        ERRORS_TOTAL.inc()
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/signal")
async def get_signal():
    """Returns the most recent signal cached in-memory (or 404 if none)."""
    if _latest_signal is None:
        raise HTTPException(status_code=404, detail="No signal available")
    return _latest_signal
