#!/usr/bin/env bash
# Run by the scanner agent after each scan, once the GitHub repo is connected.
# 1. merges the latest export into data/   2. validates   3. commits and pushes (Netlify auto-deploys)
set -euo pipefail
cd "$(dirname "$0")/.."
EXPORT_DIR="${1:-export}"
python3 scripts/merge_export.py "$EXPORT_DIR"
python3 scripts/validate.py
git add data/
if git diff --cached --quiet; then echo "No data changes"; exit 0; fi
git -c user.name="AI Incident Watch scanner" -c user.email="pmo@ai.gov.my" commit -m "data: scan $(date -u +%Y-%m-%dT%H:%MZ)"
git push origin HEAD
echo "Published"
