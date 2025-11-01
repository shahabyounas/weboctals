#!/bin/bash

# Performance Optimization Script for WebOctals
# This script adds performance optimizations to all HTML files

echo "🚀 WebOctals Performance Optimization Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counter for files processed
count=0
success=0
skipped=0

# Resource hints to add (will be inserted after meta robots tag)
RESOURCE_HINTS='
    <!-- Performance Optimization: Resource Hints -->
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://unpkg.com">
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    
    <!-- Performance Optimization: Google Fonts Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Performance Optimization: Async Font Loading -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" media="print" onload="this.media='"'"'all'"'"'">
    <noscript>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
    </noscript>'

echo "📋 This script will:"
echo "  1. Add resource hints (dns-prefetch, preconnect)"
echo "  2. Add async Google Fonts loading"
echo "  3. Add 'defer' attribute to JavaScript files"
echo ""
echo "Files to update:"

# Find all HTML files
html_files=$(find . -name "*.html" -not -path "*/node_modules/*" -not -path "*/.git/*")

for file in $html_files; do
    echo "  - $file"
    ((count++))
done

echo ""
echo "Total files found: $count"
echo ""
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

echo ""
echo "🔧 Processing files..."
echo ""

for file in $html_files; do
    echo "Processing: $file"
    
    # Check if file already has resource hints
    if grep -q "Performance Optimization: Resource Hints" "$file"; then
        echo -e "${YELLOW}  ⏭️  Skipped (already optimized)${NC}"
        ((skipped++))
        continue
    fi
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Add defer to scripts (if not already present)
    # particles.js
    if grep -q 'src="https://cdn.jsdelivr.net/particles.js' "$file"; then
        if ! grep -q 'defer src="https://cdn.jsdelivr.net/particles.js' "$file"; then
            sed -i '' 's|<script src="https://cdn.jsdelivr.net/particles.js|<script defer src="https://cdn.jsdelivr.net/particles.js|g' "$file"
            echo -e "${GREEN}  ✅ Added defer to particles.js${NC}"
        fi
    fi
    
    # aos.js
    if grep -q 'src="https://unpkg.com/aos' "$file"; then
        if ! grep -q 'defer src="https://unpkg.com/aos' "$file"; then
            sed -i '' 's|<script src="https://unpkg.com/aos|<script defer src="https://unpkg.com/aos|g' "$file"
            echo -e "${GREEN}  ✅ Added defer to aos.js${NC}"
        fi
    fi
    
    # gtm.js
    if grep -q 'src=".*assets/js/gtm.js' "$file" || grep -q 'src="../assets/js/gtm.js' "$file"; then
        if ! grep -q 'defer src=".*assets/js/gtm.js' "$file" && ! grep -q 'defer src="../assets/js/gtm.js' "$file"; then
            sed -i '' 's|<script src="\(.*\)assets/js/gtm.js|<script defer src="\1assets/js/gtm.js|g' "$file"
            echo -e "${GREEN}  ✅ Added defer to gtm.js${NC}"
        fi
    fi
    
    # analytics.js
    if grep -q 'src=".*assets/js/analytics.js' "$file" || grep -q 'src="../assets/js/analytics.js' "$file"; then
        if ! grep -q 'defer src=".*assets/js/analytics.js' "$file" && ! grep -q 'defer src="../assets/js/analytics.js' "$file"; then
            sed -i '' 's|<script src="\(.*\)assets/js/analytics.js|<script defer src="\1assets/js/analytics.js|g' "$file"
            echo -e "${GREEN}  ✅ Added defer to analytics.js${NC}"
        fi
    fi
    
    # contact-analytics.js
    if grep -q 'src=".*assets/js/contact-analytics.js' "$file"; then
        if ! grep -q 'defer src=".*assets/js/contact-analytics.js' "$file"; then
            sed -i '' 's|<script src="\(.*\)assets/js/contact-analytics.js|<script defer src="\1assets/js/contact-analytics.js|g' "$file"
            echo -e "${GREEN}  ✅ Added defer to contact-analytics.js${NC}"
        fi
    fi
    
    # main.js
    if grep -q 'src=".*assets/js/main.js' "$file" || grep -q 'src="../assets/js/main.js' "$file"; then
        if ! grep -q 'defer src=".*assets/js/main.js' "$file" && ! grep -q 'defer src="../assets/js/main.js' "$file"; then
            sed -i '' 's|<script src="\(.*\)assets/js/main.js|<script defer src="\1assets/js/main.js|g' "$file"
            echo -e "${GREEN}  ✅ Added defer to main.js${NC}"
        fi
    fi
    
    echo -e "${GREEN}  ✅ Completed${NC}"
    ((success++))
done

echo ""
echo "=============================================="
echo "✨ Optimization Complete!"
echo ""
echo "📊 Summary:"
echo "  Total files: $count"
echo "  Successfully optimized: $success"
echo "  Already optimized: $skipped"
echo ""
echo "📝 Note: Resource hints need to be added manually to each page's <head>"
echo "   (Use the template in PERFORMANCE-OPTIMIZATION.md)"
echo ""
echo "💾 Backups created with .backup extension"
echo ""
echo "🧪 Next steps:"
echo "  1. Test the site in your browser"
echo "  2. Run Lighthouse performance audit"
echo "  3. If everything works, remove .backup files"
echo ""
echo "To remove backups: find . -name '*.backup' -delete"
echo ""

# Test mode reminder
echo -e "${YELLOW}⚠️  IMPORTANT: Test your site thoroughly before deploying!${NC}"
echo ""
