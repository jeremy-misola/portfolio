i ran this script
#!/bin/bash

# Script to create fake git history for educational purposes
# This demonstrates how easily git history can be manipulated

# Navigate to the repo
cd /Users/jeremy/Documents/portfolio-frontend

# Starting date: 2 months ago
START_DATE="2025-12-16"
END_DATE="2026-02-16"

# Realistic commit messages for a portfolio project
MESSAGES=(
    "add new project section"
    "fix responsive layout bug"
    "update dependencies"
    "improve loading performance"
    "add dark mode support"
    "fix accessibility issues"
    "update portfolio images"
    "refactor component structure"
    "add new animation effects"
    "fix console errors"
    "optimize images"
    "update configurations"
    "add contact form validation"
    "improve SEO metadata"
    "fix mobile navigation"
    "add keyboard shortcuts"
    "update color scheme"
    "fix scroll behavior"
    "add lazy loading"
    "improve type safety"
    "update libraries"
    "fix styling issues"
    "add loading skeletons"
    "refactor API calls"
    "add error boundaries"
    "fix memory leaks"
    "update documentation"
    "improve bundle size"
    "add caching layer"
    "fix routing issues"
    "add sitemap generation"
    "update robots.txt"
    "fix meta tags"
    "add social media preview"
    "improve code readability"
    "add unit tests"
    "fix hydration errors"
    "update next.js version"
    "migrate to app router"
    "add i18n support"
    "fix language switcher"
    "update favicon"
    "add webmanifest"
    "fix service worker"
    "add PWA support"
    "optimize fonts"
    "fix flash of unstyled content"
    "add breadcrumbs"
    "improve navigation"
    "fix 404 page"
    "update about section"
    "add skills visualization"
    "fix timeline layout"
    "add project filters"
    "update resume download"
    "fix PDF generation"
    "add analytics tracking"
    "fix tracking script"
    "add SEO improvements"
    "improve page titles"
    "fix Open Graph tags"
    "add Twitter Card meta"
    "update contact info"
    "fix form submission"
    "add email notifications"
    "improve form validation"
    "add CAPTCHA support"
    "fix spam prevention"
    "update testimonials section"
    "add star ratings"
    "fix carousel navigation"
    "add autoplay option"
    "improve image gallery"
    "fix lightbox viewer"
    "add download button"
    "update project links"
    "fix external links"
    "add GitHub integration"
    "update LinkedIn link"
    "fix social icons"
    "add theme toggle animation"
    "improve contrast ratios"
    "fix focus states"
    "add ARIA labels"
    "improve screen reader support"
    "fix keyboard navigation"
    "add skip links"
    "update footer content"
    "add copyright year"
    "fix year display"
    "update build configuration"
    "add environment variables"
    "fix configuration issues"
    "optimize production build"
    "reduce bundle size"
    "add code splitting"
    "improve lazy loading"
    "fix image optimization"
    "add responsive breakpoints"
    "update media queries"
    "fix layout shifts"
    "add Core Web Vitals"
    "improve LCP score"
    "fix FID issues"
    "add performance monitoring"
    "update API endpoints"
    "fix rate limiting"
    "add authentication"
    "improve security headers"
    "fix CORS policy"
    "add rate limiting"
    "update error handling"
    "fix fallback UI"
    "add retry logic"
    "improve loading states"
    "add progress indicators"
    "fix spinner animation"
    "update skeleton loaders"
    "add shimmer effect"
    "improve transitions"
    "fix animation performance"
    "add micro-interactions"
    "update hover effects"
    "fix click feedback"
    "add button states"
    "improve form styles"
    "fix input focus"
    "add placeholder text"
    "update placeholder images"
    "fix broken images"
    "add image alt text"
    "improve image captions"
    "fix gallery layout"
    "add light/dark icons"
    "update icon library"
    "fix icon sizes"
    "add SVG icons"
    "update illustrations"
    "fix illustration sizes"
)

echo "Creating fake git history from $START_DATE to $END_DATE..."
echo "Pattern: Varied commits - busy days, normal days, and some empty days"
echo ""

# Convert dates to timestamps
CURRENT=$(date -j -f "%Y-%m-%d" "$START_DATE" +%s)
TOTAL_COMMITS=0

while [ $(date -j -f "%Y-%m-%d" "$END_DATE" +%s) -ge $CURRENT ]; do
    # Format date for git
    DATE_FORMATTED=$(date -j -f "%s" "$CURRENT" "+%Y-%m-%d %H:%M:%S")
    DATE_DISPLAY=$(date -j -f "%s" "$CURRENT" "+%Y-%m-%d")
    
    # Determine how many commits for today (0-6)
    RANDOM_VAL=$((RANDOM % 100))
    
    if [ $RANDOM_VAL -lt 15 ]; then
        # 15% chance - empty day (weekend/break)
        echo "Skipped: $DATE_DISPLAY (no commits)"
    elif [ $RANDOM_VAL -lt 40 ]; then
        # 25% chance - busy day (3-6 commits)
        NUM_COMMITS=$((RANDOM % 4 + 3))
        echo "Busy day: $DATE_DISPLAY - $NUM_COMMITS commits"
        
        for i in $(seq 1 $NUM_COMMITS); do
            # Add slight time variation throughout the day
            HOUR=$((RANDOM % 8 + 9))  # 9am - 4pm
            MINUTE=$((RANDOM % 60))
            TIME_FORMATTED=$(printf "%04d%02d" $HOUR $MINUTE)
            
            FULL_DATE="$DATE_DISPLAY $TIME_FORMATTED +0000"
            
            RANDOM_INDEX=$((RANDOM % ${#MESSAGES[@]}))
            MSG="${MESSAGES[$RANDOM_INDEX]}"
            
            export GIT_AUTHOR_DATE="$FULL_DATE"
            export GIT_COMMITTER_DATE="$FULL_DATE"
            
            git commit --allow-empty -m "$MSG" 2>/dev/null
            
            if [ $? -eq 0 ]; then
                echo "  → $MSG"
                TOTAL_COMMITS=$((TOTAL_COMMITS + 1))
            fi
        done
    else
        # 60% chance - normal day (1-2 commits)
        NUM_COMMITS=$((RANDOM % 2 + 1))
        
        for i in $(seq 1 $NUM_COMMITS); do
            HOUR=$((RANDOM % 8 + 9))
            MINUTE=$((RANDOM % 60))
            TIME_FORMATTED=$(printf "%04d%02d" $HOUR $MINUTE)
            
            FULL_DATE="$DATE_DISPLAY $TIME_FORMATTED +0000"
            
            RANDOM_INDEX=$((RANDOM % ${#MESSAGES[@]}))
            MSG="${MESSAGES[$RANDOM_INDEX]}"
            
            export GIT_AUTHOR_DATE="$FULL_DATE"
            export GIT_COMMITTER_DATE="$FULL_DATE"
            
            git commit --allow-empty -m "$MSG" 2>/dev/null
            
            if [ $? -eq 0 ]; then
                echo "$DATE_DISPLAY: $MSG"
                TOTAL_COMMITS=$((TOTAL_COMMITS + 1))
            fi
        done
    fi
    
    # Add one day
    CURRENT=$((CURRENT + 86400))
done

echo ""
echo "=========================================="
echo "Done! Created $TOTAL_COMMITS fake commits."
echo "=========================================="
echo ""
echo "Run 'git log' to see the new history."
echo ""
echo "IMPORTANT LESSON FOR STUDENTS:"
echo "- This demonstrates how EASY it is to fake git history"
echo "- Never trust commit dates without additional verification"
echo "- In production, use signed commits (GPG) for authenticity"
