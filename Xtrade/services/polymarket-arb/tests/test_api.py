"""Basic API tests."""
import pytest
from fastapi.testclient import TestClient

from api import app

client = TestClient(app)


def test_health():
    """Health endpoint returns ok."""
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_metrics():
    """Metrics endpoint returns Prometheus format."""
    r = client.get("/metrics")
    assert r.status_code == 200
    assert "requests_total" in r.text or "requests_total" in r.text.replace("-", "_")
