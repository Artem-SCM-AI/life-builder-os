#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Job Search Agent — Gamified Onboarding
# Collects your profile, analyzes ideal jobs, sets up credentials
# ─────────────────────────────────────────────────────────────

set -e

INSTALL_DIR="$HOME/.jobsearch"
DATA_DIR="$INSTALL_DIR/data"
PROFILE_FILE="$DATA_DIR/my_profile.md"
CONFIG_FILE="$INSTALL_DIR/config.env"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

section() {
  echo ""
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  $1${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

tip() {
  echo -e "${CYAN}  💡 $1${NC}"
  echo ""
}

clear
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Job Search Agent — Profile Setup                  ${NC}"
echo -e "${BLUE}  The more you share, the better it filters.        ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""
echo "  This takes about 15–20 minutes."
echo "  Watch the onboarding video first if you haven't."
echo ""
read -p "  Press Enter to start..."

# ── SECTION 1: WHO YOU ARE ────────────────────────────────────
section "👤 SECTION 1 of 8 — Who you are"

read -p "1. Your full name: " Q_NAME
read -p "2. Current/last job title: " Q_TITLE
read -p "3. Years of experience in this field: " Q_YEARS
echo ""
echo "4. Current status:"
echo "   [1] Employed — looking quietly"
echo "   [2] Between jobs — actively searching"
echo "   [3] Freelance / consulting"
read -p "   Enter 1, 2, or 3: " Q_STATUS_NUM
case "$Q_STATUS_NUM" in
  1) Q_STATUS="employed, looking quietly" ;;
  3) Q_STATUS="freelance / consulting" ;;
  *) Q_STATUS="between jobs, actively searching" ;;
esac

# ── SECTION 2: YOUR WINS ──────────────────────────────────────
section "🏆 SECTION 2 of 8 — Your wins"
tip "Be specific. Numbers make you stand out. This feeds your resume tailoring."

echo "5. Your top 3 achievements — each with a number."
echo "   Example: Cut logistics costs 35% (\$2M/yr), built 3PL network from 0, led team of 8"
echo ""
read -p "   → " Q_ACHIEVEMENTS

echo ""
echo "6. The one thing you fixed or built that you're most proud of. (2–3 sentences)"
read -p "   → " Q_PROUD

# ── SECTION 3: WHAT YOU WANT ──────────────────────────────────
section "🎯 SECTION 3 of 8 — What you want"
tip "Specific titles get better matches. 'Head of Supply Chain, Director of Ops' beats 'management role'."

read -p "7.  Target job titles (comma-separated, up to 5): " Q_ROLES
read -p "8.  Target industries (e.g. e-commerce, SaaS, fintech): " Q_INDUSTRIES

echo ""
echo "9.  Company stage you prefer:"
echo "    [1] Early-stage startup (<50 people)"
echo "    [2] Growth — Series A to C"
echo "    [3] Scale-up or public company"
echo "    [4] No preference"
read -p "    Enter 1–4: " Q_STAGE_NUM
case "$Q_STAGE_NUM" in
  1) Q_STAGE="early-stage startup (<50 people)" ;;
  2) Q_STAGE="growth stage, Series A to C" ;;
  3) Q_STAGE="scale-up or public company" ;;
  *) Q_STAGE="no preference on company stage" ;;
esac

read -p "10. Location preference (e.g. 'remote worldwide', 'remote US only', 'Kyiv hybrid'): " Q_LOCATION
read -p "11. Minimum salary in USD (optional — press Enter to skip): " Q_SALARY

# ── SECTION 4: HARD NO'S — ROLES ─────────────────────────────
section "🚫 SECTION 4 of 8 — Hard NO's: roles"
tip "This section is the most powerful filter. Every 'none' here means noise in your pipeline."

read -p "12. Industries to exclude (or 'none'): " Q_EXCL_INDUSTRIES
echo ""
echo "13. Role types to exclude:"
tip "Examples: individual contributor only, sales quotas, night operations, seasonal"
read -p "    → " Q_EXCL_ROLES
echo ""
echo "14. Reporting structure you don't want:"
tip "Examples: report directly to board, no direct reports, 10+ layer matrix org"
read -p "    → " Q_EXCL_REPORTING

# ── SECTION 5: HARD NO'S — COMPANIES ─────────────────────────
section "🚫 SECTION 5 of 8 — Hard NO's: companies & conditions"

echo "15. Company size to exclude:"
echo "    [1] Very small (<20 people)"
echo "    [2] Large corporate (500+ people)"
echo "    [3] Both extremes"
echo "    [4] No preference"
read -p "    Enter 1–4: " Q_EXCL_SIZE_NUM
case "$Q_EXCL_SIZE_NUM" in
  1) Q_EXCL_SIZE="companies with fewer than 20 people" ;;
  2) Q_EXCL_SIZE="companies with 500+ employees" ;;
  3) Q_EXCL_SIZE="companies with fewer than 20 or more than 500 employees" ;;
  *) Q_EXCL_SIZE="none" ;;
esac

echo ""
echo "16. Work conditions that are dealbreakers:"
tip "Examples: relocation required, travel >30%, unpaid trial projects, 100% in-office"
read -p "    → " Q_EXCL_CONDITIONS

echo ""
echo "17. Culture or environment to avoid:"
tip "Examples: micromanagement, no strategy involvement, pure execution role, toxic hustle"
read -p "    → " Q_EXCL_CULTURE

# ── SECTION 6: YOUR REAL SKILLS ───────────────────────────────
section "⚡ SECTION 6 of 8 — Your real skills"
tip "Not what's on your LinkedIn. What you actually open every day."

echo "18. Tools and systems you use regularly:"
tip "Examples: NetSuite, Flexport, Excel (advanced), Power BI, Slack, Shopify, SAP"
read -p "    → " Q_TOOLS

echo ""
echo "19. What do colleagues come to you for? (not your title — the actual thing)"
tip "Examples: fixing stockouts, supplier negotiations, building processes from scratch"
read -p "    → " Q_GOTO

echo ""
echo "20. Certifications, languages spoken, education (or 'none'):"
read -p "    → " Q_CERTS

# ── SECTION 7: YOUR SEARCH SO FAR ────────────────────────────
section "🔍 SECTION 7 of 8 — Your search so far"
tip "The agent will skip companies you've already contacted."

echo "21. Companies you've already applied to (comma-separated, or 'none'):"
read -p "    → " Q_APPLIED

echo ""
echo "22. What patterns have you noticed? What's not working?"
tip "Examples: ghosted after HR screen, overqualified feedback, only hearing from startups"
read -p "    → " Q_PATTERNS

# ── WRITE my_profile.md ───────────────────────────────────────
echo ""
echo "Saving your profile..."

cat > "$PROFILE_FILE" << PROFILE
# My Profile
Generated: $(date '+%Y-%m-%d')

## Personal Info
- Name: $Q_NAME
- Current/last role: $Q_TITLE
- Years of experience: $Q_YEARS
- Current status: $Q_STATUS

## Career Wins
- Top achievements: $Q_ACHIEVEMENTS
- Most proud of: $Q_PROUD

## Target Position
- Target roles: $Q_ROLES
- Target industries: $Q_INDUSTRIES
- Company stage preference: $Q_STAGE
- Location: $Q_LOCATION
- Minimum salary: ${Q_SALARY:-not specified}

## Hard NO's — Roles
- Excluded industries: $Q_EXCL_INDUSTRIES
- Excluded role types: $Q_EXCL_ROLES
- Excluded reporting structures: $Q_EXCL_REPORTING

## Hard NO's — Companies & Conditions
- Excluded company size: $Q_EXCL_SIZE
- Dealbreaker conditions: $Q_EXCL_CONDITIONS
- Culture to avoid: $Q_EXCL_CULTURE

## Real Skills
- Daily tools: $Q_TOOLS
- Colleagues come to me for: $Q_GOTO
- Certifications / languages / education: $Q_CERTS

## Search History
- Already applied to: $Q_APPLIED
- Patterns noticed: $Q_PATTERNS
PROFILE

echo -e "${GREEN}✓ Profile saved to $PROFILE_FILE${NC}"

# ── SECTION 8: RESUME ─────────────────────────────────────────
section "📄 SECTION 8 of 8 — Your resume"
tip "Plain text only. Remove tables, columns, graphics. More detail = better tailored resumes."

echo "Paste your full resume below."
echo "When done, type END on a new line and press Enter."
echo ""

Q_RESUME=""
while IFS= read -r line; do
  [ "$line" = "END" ] && break
  Q_RESUME="${Q_RESUME}${line}"$'\n'
done

# Append resume to profile
cat >> "$PROFILE_FILE" << RESUME

## Resume
$Q_RESUME
RESUME

echo -e "${GREEN}✓ Resume saved${NC}"

# ── BONUS TASK: 3 IDEAL JOBS ──────────────────────────────────
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  🎯 BONUS TASK — Your 3 ideal jobs                 ${NC}"
echo -e "${BLUE}  Most important step. Watch video section 3 first. ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""
echo "  Go to LinkedIn (or any job site) right now."
echo "  Find 3 jobs where you think: 'I could do this. This is me.'"
echo "  For each: open the listing → copy the full description → paste below."
echo ""
echo -e "${YELLOW}  ⏸  Take your time. This step makes everything sharper.${NC}"
echo ""
read -p "  Press Enter when ready to paste job #1..."

JOBS_FILE="$DATA_DIR/ideal_jobs_raw.md"
echo "# 3 Ideal Jobs — Raw Input" > "$JOBS_FILE"
echo "Generated: $(date '+%Y-%m-%d')" >> "$JOBS_FILE"

for i in 1 2 3; do
  echo ""
  echo "──── JOB #$i ──────────────────────────────────────────────────"
  echo "Paste job description. Type END on a new line when done."
  echo ""
  JOB_TEXT=""
  while IFS= read -r line; do
    [ "$line" = "END" ] && break
    JOB_TEXT="${JOB_TEXT}${line}"$'\n'
  done
  echo "" >> "$JOBS_FILE"
  echo "## Job #$i" >> "$JOBS_FILE"
  echo "$JOB_TEXT" >> "$JOBS_FILE"
  [ $i -lt 3 ] && read -p "  ✓ Saved. Press Enter for job #$((i+1))..."
done

echo ""
echo "⚙️  Analyzing your 3 ideal jobs..."
echo "    (This takes about 60 seconds)"
echo ""

cd "$INSTALL_DIR" && claude \
  --allowedTools "Bash,Read,Write" \
  --permission-mode bypassPermissions \
  -p "$(cat "$INSTALL_DIR/agents/jobs_analysis_agent.md")" \
  2>/dev/null

echo ""
echo -e "${GREEN}✓ Analysis complete. See above for your keyword list.${NC}"
echo ""
read -p "  ⏸  Subscribe to those alerts now, then press Enter to continue..."
