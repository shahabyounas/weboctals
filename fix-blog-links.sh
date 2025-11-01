#!/bin/bash

# Find all broken blog links and fix them
# Valid blog posts:
# - ai-agents-future-business-automation.html
# - harnessing-ai-in-seo-game-changer-for-digital-agencies.html
# - we-live-in-an-ai-first-world.html
# - website-redesign-signs.html
# - index.html

echo "🔍 Finding broken blog links..."

# List of files that don't exist
BROKEN_LINKS=(
    "building-intelligent-digital-products.html"
    "nlp-conversational-ai-development.html"
    "ai-implementation-roadmap.html"
    "machine-learning-business-applications.html"
    "ai-powered-automation-guide.html"
)

# Replacement valid link
REPLACEMENT="harnessing-ai-in-seo-game-changer-for-digital-agencies.html"

for file in blog/*.html; do
    echo "Checking $file..."
    
    for broken in "${BROKEN_LINKS[@]}"; do
        if grep -q "$broken" "$file"; then
            echo "  ✅ Fixing $broken -> $REPLACEMENT in $file"
            sed -i.bak "s|$broken|$REPLACEMENT|g" "$file"
        fi
    done
done

echo "✨ Done! Removed .bak files..."
rm -f blog/*.bak

echo "🎉 All broken blog links fixed!"
