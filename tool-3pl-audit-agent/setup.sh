#!/bin/bash
# 3PL Audit Agent — One-time setup
# Run this once: bash setup.sh

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
RATE_CARD="$BASE_DIR/data/rate_card.md"

echo ""
echo "=== 3PL Invoice Audit Agent — Setup ==="
echo ""

# 3PL info
read -p "Your 3PL name (e.g. Smart Ship Network): " PL_NAME
read -p "Warehouse location (e.g. Victorville CA): " WH_LOCATION

echo ""
echo "--- Storage rates (from your contract) ---"
read -p "Standard pallet/month (\$): " PALLET_STD
read -p "Oversized pallet/month (\$): " PALLET_OVR

echo ""
echo "--- Receiving rates ---"
read -p "Container unload (\$): " CONTAINER
read -p "Pallet in (\$): " PALLET_IN
read -p "Pallet out (\$): " PALLET_OUT

echo ""
echo "--- Pick & Pack / Parcel rates ---"
read -p "Parcel under 10 lb (\$): " PARCEL_10
read -p "Parcel 10-100 lb (\$): " PARCEL_100
read -p "Parcel 101-200 lb (\$): " PARCEL_200

echo ""
echo "--- Special handling ---"
read -p "Labeling per unit (\$): " LABELING
read -p "Order processing (\$): " ORDER_PROC
read -p "Carton pick (\$): " CARTON

echo ""
read -p "Dispute threshold — flag variances above (\$, default 50): " THRESHOLD
THRESHOLD="${THRESHOLD:-50}"

# Write rate card
cat > "$RATE_CARD" << EOF
# Rate Card — My 3PL

## 3PL Info
3PL_NAME=$PL_NAME
WAREHOUSE_LOCATION=$WH_LOCATION

## Storage
PALLET_STANDARD=$PALLET_STD
PALLET_OVERSIZED=$PALLET_OVR

## Receiving / Inbound
CONTAINER_UNLOAD=$CONTAINER
PALLET_IN=$PALLET_IN
PALLET_OUT=$PALLET_OUT

## Pick & Pack
PARCEL_UNDER_10LB=$PARCEL_10
PARCEL_10_100LB=$PARCEL_100
PARCEL_101_200LB=$PARCEL_200

## Special Handling
LABELING_PER_UNIT=$LABELING
ORDER_PROCESSING=$ORDER_PROC
CARTON_PICK=$CARTON

## Dispute Threshold
DISPUTE_THRESHOLD=$THRESHOLD
EOF

echo ""
echo "✅ Rate card saved to data/rate_card.md"

# Test macOS notification
echo ""
echo "--- Testing macOS notification ---"
osascript -e 'display notification "Setup complete. You will see alerts here when audits finish." with title "3PL Audit Agent" sound name "Glass"' 2>/dev/null
if [ $? -eq 0 ]; then
  echo "✅ macOS notifications working"
else
  echo "⚠️  macOS notifications unavailable — results will still be saved to data/ folder"
fi

# Crontab setup
echo ""
echo "--- Crontab (automatic monthly audit) ---"
read -p "Run audit automatically on the 1st of each month at 09:00? (y/n): " CRON_SETUP

if [ "$CRON_SETUP" = "y" ]; then
  USERNAME=$(whoami)
  CRON_LINE="0 9 1 * * /bin/bash $BASE_DIR/run_agent.sh 3pl_audit"
  (crontab -l 2>/dev/null | grep -v "3pl_audit"; echo "$CRON_LINE") | crontab -
  echo "✅ Crontab set: runs on the 1st of each month at 09:00"
  echo "   Edit with: crontab -e"
else
  echo "⏭  Crontab skipped — run manually: bash run_agent.sh"
fi

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Place your 3PL invoice CSV in: $BASE_DIR/invoices/"
echo "  2. Run the audit: bash run_agent.sh"
echo "  3. Find results in: $BASE_DIR/data/"
echo ""
