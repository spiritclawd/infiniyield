# INFINIYIELD — Starknet Sepolia Deployment Guide

## Prerequisites

### 1. Install Scarb (Cairo build tool)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
scarb --version  # should show 2.13.x
```

### 2. Install starknet-foundry (snforge + sncast)

```bash
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
snforge --version  # testing framework
sncast --version   # deployment tool
```

### 3. Install starkli (alternative deployment CLI)

```bash
curl https://get.starkli.sh | sh
starkli --version
```

### 4. Configure Sepolia Account

```bash
# Create or import a Starknet account for Sepolia
starkli account fetch --rpc https://free-rpc.nethermind.io/sepolia-juno/ \
  0xYOUR_ACCOUNT_ADDRESS

# Or use sncast:
sncast account import --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --name sepolia-deployer \
  --address 0xYOUR_ACCOUNT_ADDRESS \
  --private-key 0xYOUR_PRIVATE_KEY
```

Get Sepolia ETH from: https://starknet-faucet.vercel.app/

---

## Build

```bash
cd /tmp/infiniyield-contracts
scarb build
```

Compiled Sierra files will be in:
- `target/dev/infiniyield_MockWBTC.contract_class.json`
- `target/dev/infiniyield_IYToken.contract_class.json`
- `target/dev/infiniyield_MockYieldSource.contract_class.json`
- `target/dev/infiniyield_VaultCore.contract_class.json`

---

## Run Tests (requires snforge)

Enable snforge in Scarb.toml first:
```toml
[dev-dependencies]
snforge_std = { git = "https://github.com/foundry-rs/starknet-foundry.git", tag = "v0.51.2" }
```

Then:
```bash
snforge test
```

---

## Deployment Order

Contracts must be deployed in this exact order (due to constructor dependencies):

### Step 1: Deploy Mock wBTC

```bash
sncast deploy \
  --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --account sepolia-deployer \
  --class-hash $(cat target/dev/infiniyield_MockWBTC.sierra.json | jq -r '.class_hash') \
  --constructor-calldata ""
```

Save the address as `$WBTC_ADDRESS`.

### Step 2: Deploy Mock Yield Source

```bash
sncast deploy \
  --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --account sepolia-deployer \
  --class-hash $(cat target/dev/infiniyield_MockYieldSource.sierra.json | jq -r '.class_hash') \
  --constructor-calldata "$OWNER_ADDRESS"
```

Save as `$YIELD_SOURCE_ADDRESS`.

### Step 3: Deploy VaultCore (with placeholder IY)

We need to deploy vault first to get its address (for IY token constructor).

```bash
sncast deploy \
  --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --account sepolia-deployer \
  --class-hash $(cat target/dev/infiniyield_VaultCore.sierra.json | jq -r '.class_hash') \
  --constructor-calldata "$OWNER_ADDRESS $WBTC_ADDRESS 0x0 $YIELD_SOURCE_ADDRESS $TREASURY_ADDRESS"
```

Save as `$VAULT_ADDRESS`.

### Step 4: Deploy IY Token (with real vault address)

```bash
sncast deploy \
  --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --account sepolia-deployer \
  --class-hash $(cat target/dev/infiniyield_IYToken.sierra.json | jq -r '.class_hash') \
  --constructor-calldata "$VAULT_ADDRESS"
```

Save as `$IY_TOKEN_ADDRESS`.

### Step 5: Re-deploy VaultCore (with real IY address)

```bash
sncast deploy \
  --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --account sepolia-deployer \
  --class-hash $(cat target/dev/infiniyield_VaultCore.sierra.json | jq -r '.class_hash') \
  --constructor-calldata "$OWNER_ADDRESS $WBTC_ADDRESS $IY_TOKEN_ADDRESS $YIELD_SOURCE_ADDRESS $TREASURY_ADDRESS"
```

Save as `$VAULT_FINAL_ADDRESS`.

### Step 6: Re-deploy IY Token (pointing to final vault)

```bash
sncast deploy \
  --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --account sepolia-deployer \
  --class-hash $(cat target/dev/infiniyield_IYToken.sierra.json | jq -r '.class_hash') \
  --constructor-calldata "$VAULT_FINAL_ADDRESS"
```

**Note**: Alternatively, add a `set_iy_token(addr)` admin function to VaultCore 
to avoid this two-step process. The MVP doesn't include it for simplicity.

---

## Post-Deployment: Verify on Starkscan

1. Go to https://sepolia.starkscan.co/
2. Search for each contract address
3. Verify the ABI matches expected interface

---

## Testing on Sepolia

### Mint test wBTC
```bash
sncast invoke \
  --url https://free-rpc.nethermind.io/sepolia-juno/ \
  --account sepolia-deployer \
  --contract-address $WBTC_ADDRESS \
  --function mint \
  --calldata "$YOUR_ADDRESS 100000000 0"  # 1 BTC = 1e8 sats (u256 = low, high)
```

### Approve vault to spend wBTC
```bash
sncast invoke \
  --contract-address $WBTC_ADDRESS \
  --function approve \
  --calldata "$VAULT_FINAL_ADDRESS 100000000 0"
```

### Deposit into vault
```bash
sncast invoke \
  --contract-address $VAULT_FINAL_ADDRESS \
  --function deposit \
  --calldata "100000000 0"  # 1 BTC
```

### Check leaderboard
```bash
sncast call \
  --contract-address $VAULT_FINAL_ADDRESS \
  --function get_leaderboard
```

### Simulate yield (owner only)
```bash
sncast invoke \
  --contract-address $YIELD_SOURCE_ADDRESS \
  --function simulate_yield \
  --calldata "1000000 0"  # 0.01 BTC yield
```

### Harvest yield
```bash
sncast invoke \
  --contract-address $VAULT_FINAL_ADDRESS \
  --function harvest_and_distribute
```

### End season (after 100 blocks on testnet)
```bash
sncast invoke \
  --contract-address $VAULT_FINAL_ADDRESS \
  --function end_season
```

---

## Season Configuration

To change season length for production (edit `vault_core.cairo`):

```cairo
// Line ~53 in vault_core.cairo
/// TESTING: 100 blocks
const SEASON_BLOCKS: u64 = 100;

/// PRODUCTION: ~60 days at 2s/block
// const SEASON_BLOCKS: u64 = 2_592_000;
```

---

## Sepolia RPC Endpoints

| Provider | URL |
|----------|-----|
| Nethermind (free) | https://free-rpc.nethermind.io/sepolia-juno/ |
| Infura | https://starknet-sepolia.infura.io/v3/YOUR_KEY |
| Alchemy | https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/YOUR_KEY |

---

## Contract Addresses (fill in after deployment)

| Contract | Address |
|----------|---------|
| MockWBTC | |
| IYToken | |
| MockYieldSource | |
| VaultCore | |

---

## Verification Checklist

- [ ] MockWBTC deployed, mint() works
- [ ] IYToken deployed, vault_mint() restricted to vault
- [ ] MockYieldSource deployed, simulate_yield() works
- [ ] VaultCore deployed with correct addresses
- [ ] deposit() transfers wBTC, mints IY
- [ ] Leaderboard updates correctly
- [ ] harvest_and_distribute() fills pool
- [ ] end_season() resets t_effective (check principal unchanged)
- [ ] claim_yield() enforces cooldown and 1% fee
- [ ] **Confirm NO withdraw() function exists**
