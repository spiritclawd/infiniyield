#!/usr/bin/env bash
# INFINIYIELD — Sepolia Deploy Script
# Run from contracts/ directory after funding the deployer account.
#
# Usage:
#   cd contracts
#   OWNER=0x<your_address> TREASURY=0x<treasury_addr> bash deploy-sepolia.sh

set -e

RPC="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
ACCOUNT="sepolia-deployer"
ACCOUNTS_FILE="$HOME/.starknet_accounts/starknet_open_zeppelin_accounts.json"

OWNER="${OWNER:-$(sncast --url $RPC account list 2>/dev/null | grep address | head -1 | awk '{print $2}')}"
TREASURY="${TREASURY:-$OWNER}"  # default treasury = owner

if [ -z "$OWNER" ]; then
  echo "ERROR: Set OWNER env variable to your deployer address"
  exit 1
fi

echo "=== INFINIYIELD Sepolia Deploy ==="
echo "Owner:    $OWNER"
echo "Treasury: $TREASURY"
echo ""

# Build first
echo "--- Building contracts ---"
scarb build

# ── Step 1: Declare all contracts ──────────────────────────────────────

echo ""
echo "--- Declaring MockWBTC ---"
WBTC_CLASS=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  declare --contract-name MockWBTC 2>&1 | grep "class_hash:" | awk '{print $2}')
echo "MockWBTC class: $WBTC_CLASS"

echo ""
echo "--- Declaring MockYieldSource ---"
YIELD_CLASS=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  declare --contract-name MockYieldSource 2>&1 | grep "class_hash:" | awk '{print $2}')
echo "MockYieldSource class: $YIELD_CLASS"

echo ""
echo "--- Declaring IYToken ---"
IY_CLASS=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  declare --contract-name IYToken 2>&1 | grep "class_hash:" | awk '{print $2}')
echo "IYToken class: $IY_CLASS"

echo ""
echo "--- Declaring VaultCore ---"
VAULT_CLASS=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  declare --contract-name VaultCore 2>&1 | grep "class_hash:" | awk '{print $2}')
echo "VaultCore class: $VAULT_CLASS"

# ── Step 2: Deploy instances ────────────────────────────────────────────

echo ""
echo "--- Deploying MockWBTC ---"
WBTC_ADDR=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  deploy --class-hash $WBTC_CLASS \
  --constructor-calldata $OWNER \
  2>&1 | grep "contract_address:" | awk '{print $2}')
echo "MockWBTC: $WBTC_ADDR"

echo ""
echo "--- Deploying MockYieldSource ---"
YIELD_ADDR=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  deploy --class-hash $YIELD_CLASS \
  --constructor-calldata $OWNER $WBTC_ADDR \
  2>&1 | grep "contract_address:" | awk '{print $2}')
echo "MockYieldSource: $YIELD_ADDR"

echo ""
echo "--- Deploying VaultCore (iy_token=0x0 placeholder) ---"
# Constructor: owner, wbtc, iy_token (placeholder 0x0), yield_source, treasury
VAULT_ADDR=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  deploy --class-hash $VAULT_CLASS \
  --constructor-calldata $OWNER $WBTC_ADDR 0x0 $YIELD_ADDR $TREASURY \
  2>&1 | grep "contract_address:" | awk '{print $2}')
echo "VaultCore: $VAULT_ADDR"

echo ""
echo "--- Deploying IYToken (vault=$VAULT_ADDR) ---"
# Constructor: name (felt), symbol (felt), decimals, vault_address
# "InfiniYield" as felt = 0x496e66696e695969656c64
# "IY" as felt = 0x4959
IY_ADDR=$(sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  deploy --class-hash $IY_CLASS \
  --constructor-calldata 0x496e66696e695969656c64 0x4959 18 $VAULT_ADDR \
  2>&1 | grep "contract_address:" | awk '{print $2}')
echo "IYToken: $IY_ADDR"

echo ""
echo "--- Setting IYToken on VaultCore ---"
sncast \
  --url $RPC --account $ACCOUNT --accounts-file $ACCOUNTS_FILE \
  invoke \
  --contract-address $VAULT_ADDR \
  --function "set_iy_token" \
  --calldata $IY_ADDR

echo ""
echo "=== DEPLOY COMPLETE ==="
echo ""
echo "Add these to .env.local:"
echo "NEXT_PUBLIC_NETWORK=sepolia"
echo "NEXT_PUBLIC_VAULT_CONTRACT=$VAULT_ADDR"
echo "NEXT_PUBLIC_WBTC_CONTRACT=$WBTC_ADDR"
echo "NEXT_PUBLIC_IY_TOKEN_CONTRACT=$IY_ADDR"
echo "NEXT_PUBLIC_TREASURY_ADDRESS=$TREASURY"
