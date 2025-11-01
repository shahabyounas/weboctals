#!/bin/bash

# WebOctals - Add Google Analytics to All Pages
# This script adds GA4 tracking to all HTML pages

echo "🎯 Adding Google Analytics to All WebOctals Pages"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counters
total=0
updated=0
skipped=0
errors=0

# Google Analytics tag to add
GA_TAG='
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-SM3W8072KB"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('\''js'\'', new Date());
      gtag('\''config'\'', '\''G-SM3W8072KB'\'');
    </script>'

# Find all HTML files (exclude templates)
echo "🔍 Finding HTML files..."
html_files=$(find . -name "*.html" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -name "analytics-template.html" \
    -not -name "performance-template.html" \
    -not -name "services-old.html")

for file in $html_files; do
    ((total++))
done

echo "📊 Found $total HTML files to process"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "🚀 Processing files..."
echo ""

for file in $html_files; do
    filename=$(basename "$file")
    echo -e "${BLUE}Processing: $file${NC}"
    
    # Skip if already has Google Analytics
    if grep -q "gtag.js?id=G-SM3W8072KB" "$file"; then
        echo -e "${YELLOW}  ⏭️  Already has GA4 - Checking analytics.js${NC}"
        
        # Check if analytics.js is present
        if grep -q "assets/js/analytics.js\|../assets/js/analytics.js" "$file"; then
            echo -e "${YELLOW}  ✅ analytics.js already present${NC}"
            ((skipped++))
        else
            # Add analytics.js
            if [[ "$file" == *"/blog/"* ]]; then
                # Blog files need ../
                if grep -q "</body>" "$file"; then
                    # Find the last script tag before </body>
                    if grep -q "assets/js/main.js\|../assets/js/main.js" "$file"; then
                        # Add before main.js
                        sed -i '' 's|<script defer src="../assets/js/main.js">|<script defer src="../assets/js/analytics.js"></script>\n    <script defer src="../assets/js/main.js">|' "$file"
                        echo -e "${GREEN}  ✅ Added analytics.js (blog)${NC}"
                        ((updated++))
                    else
                        echo -e "${YELLOW}  ⚠️  Could not find main.js${NC}"
                        ((skipped++))
                    fi
                fi
            else
                # Root level files
                if grep -q "assets/js/main.js" "$file"; then
                    sed -i '' 's|<script defer src="assets/js/main.js">|<script defer src="assets/js/analytics.js"></script>\n    <script defer src="assets/js/main.js">|' "$file"
                    echo -e "${GREEN}  ✅ Added analytics.js${NC}"
                    ((updated++))
                else
                    echo -e "${YELLOW}  ⚠️  Could not find main.js${NC}"
                    ((skipped++))
                fi
            fi
        fi
        continue
    fi
    
    # Create backup
    cp "$file" "$file.ga-backup"
    
    # Determine where to insert GA tag
    # Try to find after fonts/resources and before Open Graph or other meta tags
    
    if grep -q "<!-- Open Graph" "$file"; then
        # Insert before Open Graph
        awk -v ga="$GA_TAG" '
            /<!-- Open Graph/ && !inserted {
                print ga
                print ""
                inserted=1
            }
            { print }
        ' "$file" > "$file.tmp"
        mv "$file.tmp" "$file"
        echo -e "${GREEN}  ✅ Added GA4 tag (before Open Graph)${NC}"
    elif grep -q "<!-- Canonical URL -->" "$file"; then
        # Insert before Canonical
        awk -v ga="$GA_TAG" '
            /<!-- Canonical URL -->/ && !inserted {
                print ga
                print ""
                inserted=1
            }
            { print }
        ' "$file" > "$file.tmp"
        mv "$file.tmp" "$file"
        echo -e "${GREEN}  ✅ Added GA4 tag (before Canonical)${NC}"
    elif grep -q '<link rel="stylesheet"' "$file"; then
        # Insert before first stylesheet
        awk -v ga="$GA_TAG" '
            /<link rel="stylesheet"/ && !inserted {
                print ga
                print ""
                inserted=1
            }
            { print }
        ' "$file" > "$file.tmp"
        mv "$file.tmp" "$file"
        echo -e "${GREEN}  ✅ Added GA4 tag (before stylesheets)${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Could not find insertion point${NC}"
        rm "$file.ga-backup"
        ((skipped++))
        continue
    fi
    
    # Add analytics.js script
    if [[ "$file" == *"/blog/"* ]]; then
        # Blog files need ../assets/js/
        if grep -q "../assets/js/main.js" "$file"; then
            sed -i '' 's|<script defer src="../assets/js/main.js">|<script defer src="../assets/js/analytics.js"></script>\n    <script defer src="../assets/js/main.js">|' "$file"
            echo -e "${GREEN}  ✅ Added analytics.js (blog)${NC}"
        elif grep -q "src=\"../assets/js/gtm.js\"" "$file"; then
            sed -i '' 's|<script defer src="../assets/js/gtm.js">|<script defer src="../assets/js/analytics.js"></script>\n    <script defer src="../assets/js/gtm.js">|' "$file"
            echo -e "${GREEN}  ✅ Added analytics.js after gtm (blog)${NC}"
        else
            # Add before </body>
            sed -i '' 's|</body>|    <script defer src="../assets/js/analytics.js"></script>\n</body>|' "$file"
            echo -e "${GREEN}  ✅ Added analytics.js before </body> (blog)${NC}"
        fi
    else
        # Root level pages
        if grep -q 'src="assets/js/main.js"' "$file"; then
            sed -i '' 's|<script defer src="assets/js/main.js">|<script defer src="assets/js/analytics.js"></script>\n    <script defer src="assets/js/main.js">|' "$file"
            echo -e "${GREEN}  ✅ Added analytics.js${NC}"
        elif grep -q 'src="assets/js/gtm.js"' "$file"; then
            sed -i '' 's|<script defer src="assets/js/gtm.js">|<script defer src="assets/js/analytics.js"></script>\n    <script defer src="assets/js/gtm.js">|' "$file"
            echo -e "${GREEN}  ✅ Added analytics.js after gtm${NC}"
        else
            # Add before </body>
            sed -i '' 's|</body>|    <script defer src="assets/js/analytics.js"></script>\n</body>|' "$file"
            echo -e "${GREEN}  ✅ Added analytics.js before </body>${NC}"
        fi
    fi
    
    ((updated++))
    echo ""
done

echo "=================================================="
echo "✨ Google Analytics Deployment Complete!"
echo ""
echo "📊 Summary:"
echo "  Total files found: $total"
echo "  Successfully updated: $updated"
echo "  Already had GA4: $skipped"
echo "  Errors: $errors"
echo ""
echo "📝 Backups created with .ga-backup extension"
echo ""
echo "🧪 Next Steps:"
echo "  1. Test a few pages in your browser"
echo "  2. Check Console (F12) for analytics messages"
echo "  3. Verify in GA4 Real-Time reports"
echo "  4. If everything works, remove backups:"
echo "     find . -name '*.ga-backup' -delete"
echo ""
echo -e "${GREEN}✅ All pages now have Google Analytics tracking!${NC}"
echo ""
