#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p dist
cp site/index.html site/style.css site/app.js site/pixelpunk-share.jpg dist/
python3 scripts/check-links.py
node --check dist/app.js
