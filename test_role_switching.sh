#!/usr/bin/env bash
set -e

# Use the built-in REPL_URL env var (or fall back to slug/owner)
REPL_URL="${REPL_URL:-https://${REPL_SLUG}.${REPL_OWNER}.repl.co}"
COOKIE_JAR="$(mktemp)"

echo "=== 1. Healthcheck ==="
curl -s "${REPL_URL}/healthz" && echo -e "\n"

echo "=== 2. Login as Parent ==="
curl -s -c "${COOKIE_JAR}" \
  -H "Content-Type: application/json" \
  -d '{"email":"multiuser@example.com","password":"password123","role":"parent"}' \
  "${REPL_URL}/api/login" | jq
echo -e "\n"

echo "=== 3. Switch to Caregiver ==="
curl -s -b "${COOKIE_JAR}" \
  -H "Content-Type: application/json" \
  -d '{"role":"caregiver"}' \
  "${REPL_URL}/api/auth/switch-role" | jq
echo -e "\n"

echo "=== 4. Access Parent Dashboard (should 200) ==="
curl -s -b "${COOKIE_JAR}" -I "${REPL_URL}/dashboard" | head -n 1
echo -e "\n"

echo "=== 5. Access Caregiver Dashboard (should 200) ==="
curl -s -b "${COOKIE_JAR}" -I "${REPL_URL}/dashboard" | head -n 1
echo -e "\n"

echo "=== 6. Parent-only: Post a Job (expect success) ==="
curl -s -b "${COOKIE_JAR}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","description":"Smoke-test job","startDate":"2025-07-01","hoursPerWeek":5,"rate":25}' \
  "${REPL_URL}/api/jobs" | jq
echo -e "\n"

echo "=== All tests complete ==="