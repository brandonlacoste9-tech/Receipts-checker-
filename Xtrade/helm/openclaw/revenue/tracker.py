#!/usr/bin/env python3
"""
Revenue Tracker - Sums Stripe payouts and flips SWITCH_TO_EXTERNAL=1 when target is met.
Run as a Kubernetes CronJob; updates the revenue-switch secret when revenue threshold is reached.
"""
import os
import sys
from datetime import datetime, timedelta

try:
    import stripe
    from kubernetes import client, config
except ImportError:
    print("ERROR: Install stripe and kubernetes: pip install stripe kubernetes", file=sys.stderr)
    sys.exit(1)


def get_stripe_revenue_cents(stripe_key: str, lookback_days: int) -> int:
    """Sum successful payment intents in the lookback period. Returns total in cents."""
    stripe.api_key = stripe_key
    since = datetime.utcnow() - timedelta(days=lookback_days)
    since_ts = int(since.timestamp())

    total_cents = 0
    for pi in stripe.PaymentIntent.list(created={"gte": since_ts}, limit=100).auto_paging_iter():
        if pi.status == "succeeded" and pi.amount:
            total_cents += pi.amount

    return total_cents


def update_revenue_switch_secret(namespace: str, secret_name: str, value: str) -> None:
    """Create or patch the revenue-switch secret with SWITCH_TO_EXTERNAL."""
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()

    v1 = client.CoreV1Api()
    secret_data = {"SWITCH_TO_EXTERNAL": value.encode("utf-8")}

    try:
        existing = v1.read_namespaced_secret(secret_name, namespace)
        existing.data = secret_data
        v1.replace_namespaced_secret(secret_name, namespace, existing)
        print(f"Updated secret {secret_name}/{namespace}")
    except client.rest.ApiException as e:
        if e.status == 404:
            secret = client.V1Secret(
                metadata=client.V1ObjectMeta(name=secret_name, namespace=namespace),
                data=secret_data,
            )
            v1.create_namespaced_secret(namespace, secret)
            print(f"Created secret {secret_name}/{namespace}")
        else:
            raise


def main() -> None:
    stripe_key = os.environ.get("STRIPE_SECRET_KEY")
    if not stripe_key:
        print("ERROR: STRIPE_SECRET_KEY not set", file=sys.stderr)
        sys.exit(1)

    target_cents = int(os.environ.get("REVENUE_TARGET_CENTS", "50000"))
    lookback_days = int(os.environ.get("LOOKBACK_DAYS", "30"))
    secret_name = os.environ.get("SWITCH_SECRET_NAME", "revenue-switch")
    namespace = os.environ.get("SWITCH_SECRET_NAMESPACE", "arbitrage")

    total = get_stripe_revenue_cents(stripe_key, lookback_days)
    print(f"Revenue (last {lookback_days}d): ${total/100:.2f} / ${target_cents/100:.2f} target")

    if total >= target_cents:
        update_revenue_switch_secret(namespace, secret_name, "1")
        print("Target reached. SWITCH_TO_EXTERNAL=1 set.")
    else:
        update_revenue_switch_secret(namespace, secret_name, "0")
        print("Target not yet reached. SWITCH_TO_EXTERNAL=0.")


if __name__ == "__main__":
    main()
