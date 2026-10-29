#!/usr/bin/env python3
"""Validate data/*.json before publish. Exit 1 on any problem so a bad sync never goes live."""
import json, re, sys, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SEV = {"Critical", "High", "Medium", "Low"}
STAGES = {"Received", "Assessed", "Contained", "Shared", "New", "Acknowledged", "Monitoring", "Closed"}
KINDS = {"incident", "near-miss", "threat"}
INITS = {"AI Governance", "AI Cities", "AI Safety", "Both"}
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
errors = []

def load(name):
    p = os.path.join(ROOT, "data", name)
    try:
        return json.load(open(p, encoding="utf-8"))
    except Exception as e:
        errors.append(f"{name}: cannot parse ({e})"); return None

inc = load("incidents.json")
if isinstance(inc, list):
    ids = set()
    for r in inc:
        rid = r.get("id", "?")
        if rid in ids: errors.append(f"incidents: duplicate id {rid}")
        ids.add(rid)
        for f in ("title", "severity", "initiative", "event_date", "detected_at", "status"):
            if not r.get(f): errors.append(f"incidents/{rid}: missing {f}")
        if r.get("severity") not in SEV: errors.append(f"incidents/{rid}: bad severity {r.get('severity')}")
        if r.get("status") not in STAGES: errors.append(f"incidents/{rid}: bad status {r.get('status')}")
        if r.get("kind", "incident") not in KINDS: errors.append(f"incidents/{rid}: bad kind {r.get('kind')}")
        if r.get("initiative") not in INITS: errors.append(f"incidents/{rid}: bad initiative {r.get('initiative')}")
        if r.get("event_date") and not DATE.match(r["event_date"]): errors.append(f"incidents/{rid}: event_date not YYYY-MM-DD")
        if r.get("source_url") and not r["source_url"].startswith("http"): errors.append(f"incidents/{rid}: source_url not http(s)")
        if r.get("origin") == "scanner" and not r.get("source_url"): errors.append(f"incidents/{rid}: scanner item without source_url")
else:
    errors.append("incidents.json must be a list")

for name in ("scans.json", "initiatives.json"):
    d = load(name)
    if d is not None and not isinstance(d, list): errors.append(f"{name} must be a list")
cfg = load("config.json")
if cfg is not None and not isinstance(cfg, dict): errors.append("config.json must be an object")

if errors:
    print("DATA VALIDATION FAILED"); [print(" -", e) for e in errors]; sys.exit(1)
print(f"Data OK: {len(inc)} records")
