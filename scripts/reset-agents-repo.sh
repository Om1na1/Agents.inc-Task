#!/usr/bin/env bash
# Resets contributor cache for Om1na1/Agents.inc-Task by recreating the repo.
# Run AFTER deleting the repo at: https://github.com/Om1na1/Agents.inc-Task/settings

set -euo pipefail

REPO="Om1na1/Agents.inc-Task"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

echo "Creating repository ${REPO}..."
gh repo create "$REPO" --public \
  --description "OKLCH Color Picker - Agents.inc take-home task" \
  --source=. \
  --remote=origin \
  --push

echo ""
echo "Done. Contributors should show only Om1na1:"
echo "https://github.com/${REPO}/graphs/contributors"
