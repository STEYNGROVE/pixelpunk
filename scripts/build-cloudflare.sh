#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
sh scripts/build.sh
mkdir -p cloudflare-dist
cp dist/index.html dist/style.css dist/app.js cloudflare/_headers cloudflare/404.html cloudflare/favicon.ico cloudflare-dist/

python3 - <<'PY'
from os import environ
from pathlib import Path
from urllib.parse import urlsplit

canonical = environ.get("PIXELPUNK_CANONICAL_URL", "https://pixelpunk.pages.dev/")
url = urlsplit(canonical)
if url.scheme != "https" or not url.hostname or url.path != "/" or url.query or url.fragment:
    raise SystemExit("PIXELPUNK_CANONICAL_URL must be an HTTPS origin with a trailing slash")

index = Path("cloudflare-dist/index.html")
html = index.read_text(encoding="utf-8")
html = html.replace("https://steyngrove.github.io/pixelpunk/", canonical)
html = html.replace(
    '<p>Prefer the original enquiry form? Hatchable sign-in is required.</p>\n'
    '<a class="outline" href="https://pixelpunk.hatchable.site/brief.html">'
    'OPEN HATCHABLE ENQUIRY FORM ↗</a>',
    "",
)
index.write_text(html, encoding="utf-8")
PY
