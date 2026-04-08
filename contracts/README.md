# INFINIYIELD — "Trap the Whale"

> "winning is easy, put more money than the rest...  
>  if there is no one with more money than you."

---

## What is Trap the Whale?

**Trap the Whale** is a permadep yield competition on Starknet.

You deposit wBTC. Forever. There is no withdraw function. This is not a bug — this is the game.

Your deposits earn yield from DeFi protocols (Vesu). The top 10 depositors on the leaderboard each season share 70% of all yield. The catch? You have to *out-commit* everyone else.

---

## The Core Loop

1. **Deposit wBTC** — permanently. Receive IY tokens.
2. **Earn score** over time — more BTC deposited = faster score accumulation.
3. **Climb the leaderboard** — top 10 get quadratic yield shares each season.
4. **Season ends** (every 60 days) — scores reset to zero, principal stays forever.
5. **Repeat** — new season, same principals, fresh competition.

---

## Scoring (Linear — No Sybil)

```
score = principal_sats × t_effective_scaled / 100
```

`t_effective_scaled` accumulates per block:
- **Days 1-45**: +100 per day
- **Days 46-90**: +70 per day  
- **Days 91+**: +40 per day

**Why linear? Anti-sybil by design.**

Splitting 1 BTC across 2 wallets (0.5 + 0.5) gives the *exact same total score* as 1 wallet with 1 BTC. There is zero incentive to split. The game rewards commitment and capital, nothing else.

---

## Yield Distribution (Per Season)

| Recipient | Share | Mechanism |
|-----------|-------|-----------|
| Top 10 depositors | 70% | Quadratic: rank 1 gets (10²/385), rank 2 gets (9²/385), etc. |
| All depositors | 20% | Pro-rata by principal deposited |
| Treasury | 10% | Protocol fee |

### Quadratic Rank Shares

| Rank | Share Numerator | % of Top-10 pool |
|------|-----------------|-------------------|
| 1 | 100 (10²) | 25.97% |
| 2 | 81 (9²) | 21.04% |
| 3 | 64 (8²) | 16.62% |
| 4 | 49 (7²) | 12.73% |
| 5 | 36 (6²) | 9.35% |
| 6 | 25 (5²) | 6.49% |
| 7 | 16 (4²) | 4.16% |
| 8 | 9 (3²) | 2.34% |
| 9 | 4 (2²) | 1.04% |
| 10 | 1 (1²) | 0.26% |

---

## Claiming Yield

- **Claim fee**: 1%
- **Cooldown**: 24 hours (43,200 blocks)
- **Minimum**: 1,000 sats

---

## Season Parameters

| Parameter | Testing | Production |
|-----------|---------|------------|
| Season duration | 100 blocks | 2,592,000 blocks (~60 days) |
| Blocks per day | 43,200 | 43,200 |

---

## Contract Architecture

```
vault_core.cairo      — main game engine
  ├── deposit()       — permanent lock, mint IY
  ├── harvest_and_distribute() — pull yield into pool
  ├── claim_yield()   — withdraw earned yield (not principal)
  └── end_season()    — distribute + reset scores

leaderboard.cairo     — top-10 helpers & math

mock_wbtc.cairo       — testnet wBTC (8 decimals, free mint)
iy_token.cairo        — IY reward token (18 decimals, vault-only mint)
mock_yield_source.cairo — simulates Vesu yield for testing
```

---

## IY Token

- **Name**: InfiniYield
- **Symbol**: IY
- **Decimals**: 18
- **Mint rate**: 1 IY per 1,000 sats deposited
- **Mint authority**: Vault only

IY tokens are governance/reputation tokens — proof of your commitment to the protocol.

---

## Security Properties

1. **No withdraw function** — principal is permanent. Code is law.
2. **Principal only increases** — the game is one-directional.
3. **t_effective resets per season** — fresh competition every cycle.
4. **Linear scoring** — no mathematical advantage to wallet splitting.
5. **Permissionless season end** — anyone can trigger after duration.
6. **Claim reentrancy safety** — claimable zeroed before transfer.

---

## Testnet (Sepolia)

See [DEPLOY.md](./DEPLOY.md) for step-by-step deployment instructions.

Quick start:
```bash
scarb build
# Deploy with sncast or Starknet CLI
```

---

*Built on Starknet. Powered by Vesu yield. Zero-withdrawal by design.*
