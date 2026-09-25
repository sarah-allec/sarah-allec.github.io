#!/bin/sh
# Rebuild the site and render the CV page to img/sarah_allec_cv.pdf with headless Chrome.
set -e
cd "$(dirname "$0")/.."
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle exec jekyll build --quiet
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf="$PWD/img/sarah_allec_cv.pdf" "file://$PWD/_site/cv/index.html" 2>/dev/null
echo "Wrote img/sarah_allec_cv.pdf"
