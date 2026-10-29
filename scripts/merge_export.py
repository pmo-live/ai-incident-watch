#!/usr/bin/env python3
"""Merge an export from the officer console database into data/*.json.

Usage:  python3 scripts/merge_export.py <export_dir>
<export_dir> holds incidents/<id>.json, scans/<id>.json, initiatives/<id>.json, config/alerts.json
(each file either the raw document or {"data": {...}, "version": n}).
Items with "public": false are kept in the file but hidden by the site.
"""
import glob, json, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
src = sys.argv[1] if len(sys.argv) > 1 else "export"
out = os.path.join(ROOT, "data"); os.makedirs(out, exist_ok=True)

def body(p):
    d = json.load(open(p, encoding="utf-8"))
    return dict(d["data"]) if isinstance(d, dict) and isinstance(d.get("data"), dict) else d

for col in ("incidents", "scans", "initiatives"):
    files = sorted(glob.glob(os.path.join(src, col, "*.json")))
    if not files:
        print(f"{col}: nothing in export, keeping current file"); continue
    rows = []
    for f in files:
        r = body(f); r["id"] = os.path.basename(f)[:-5]
        # strip officer-only fields from the public copy
        for k in ("owner", "containment", "reported_by", "root_cause"):
            r.pop(k, None)
        rows.append(r)
    json.dump(rows, open(os.path.join(out, f"{col}.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(f"{col}: {len(rows)} records")
cfgp = os.path.join(src, "config", "alerts.json")
if os.path.exists(cfgp):
    json.dump(body(cfgp), open(os.path.join(out, "config.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print("config: written")
