# Rate Card — My 3PL

Fill in your actual rates from your 3PL contract.
This file is read by the audit agent before every analysis.

---

## 3PL Info
3PL_NAME=Smart Ship Network
WAREHOUSE_LOCATION=Victorville CA

---

## Storage
PALLET_STANDARD=13.50
PALLET_OVERSIZED=27.00

---

## Receiving / Inbound
CONTAINER_UNLOAD=590.00
PALLET_IN=10.00
PALLET_OUT=10.00

---

## Pick & Pack
PARCEL_UNDER_10LB=1.75
PARCEL_10_100LB=2.35
PARCEL_101_200LB=4.70

---

## Special Handling
LABELING_PER_UNIT=0.45
ORDER_PROCESSING=8.00
CARTON_PICK=1.50

---

## Dispute Threshold
# Flag any line where variance exceeds this amount (USD)
DISPUTE_THRESHOLD=50.00

---

## Notes
# Add any custom charges or exceptions specific to your contract here.
# Example: "Holiday surcharge: +$2.00/pallet Nov-Dec"
