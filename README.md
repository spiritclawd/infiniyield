# INFINIYIELD ♾️

> **Entry fees compound into infinite yield for top players**

INFINIYIELD is a gaming platform where every entry fee flows into BTC-backed vaults that generate perpetual yield. Top players earn their share of the accumulated rewards.

---

## 🎮 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE INFINIYIELD FLYWHEEL                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Player pays entry fee (e.g., 0.001 BTC)                        │
│                     │                                             │
│                     ▼                                             │
│          ┌─────────────────────┐                                 │
│          │    FEE SPLITTER     │                                 │
│          │   90% / 10% split   │                                 │
│          └──────────┬──────────┘                                 │
│                     │                                             │
│          ┌──────────┴──────────┐                                 │
│          ▼                     ▼                                 │
│   ┌─────────────┐      ┌──────────────┐                         │
│   │  90% VAULT  │      │ 10% Platform │                         │
│   │  (BTC Pool) │      │  (Treasury)  │                         │
│   └──────┬──────┘      └──────────────┘                         │
│          │                                                        │
│          ▼                                                        │
│   ┌──────────────────────────────────────────────────────┐      │
│   │           ENDURANCE BTC STAKING                        │      │
│   │           ~5% APY on Starknet                          │      │
│   │           (via starkzap integration)                   │      │
│   └─────────────────────────┬────────────────────────────┘      │
│                             │                                     │
│                             ▼                                     │
│   ┌──────────────────────────────────────────────────────┐      │
│   │           ACCUMULATED YIELD                           │      │
│   │           Distributed to top 50% of players           │      │
│   │                                                        │      │
│   │   Top 1     → 30% of yield                            │      │
│   │   Top 2-5   → 25% of yield                            │      │
│   │   Top 6-10  → 20% of yield                            │      │
│   │   Top 11-25 → 15% of yield                            │      │
│   │   Top 26-50 → 10% of yield                            │      │
│   └──────────────────────────────────────────────────────┘      │
│                                                                   │
│   💡 KEY INSIGHT: Principal NEVER decreases, only grows.          │
│      More games = bigger vault = more yield = more players.      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/spiritclawd/infiniyield.git
cd infiniyield

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 | React framework for Vercel deployment |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **State** | Zustand | Lightweight state management |
| **Wallet** | starkzap + Cartridge | Starknet wallet integration |
| **Yield** | Endurance | BTC staking on Starknet |
| **Network** | Starknet | Layer 2 for low fees |

---

## 💰 Money Flow

### Entry Fee Split

```typescript
import { calculateFeeSplit, formatBTC } from '@/lib/money-flow';

// Calculate fee split for 0.001 BTC entry
const split = calculateFeeSplit(100000n); // 100,000 satoshis = 0.001 BTC

console.log(`Vault receives: ${formatBTC(split.vaultAmount)}`);    // 0.0009 BTC (90%)
console.log(`Platform receives: ${formatBTC(split.platformAmount)}`); // 0.0001 BTC (10%)
```

### Yield Distribution

```typescript
import { calculateYieldDistribution, getYieldShareForRank } from '@/lib/money-flow';

// Total yield to distribute: 0.05 BTC
const distributions = calculateYieldDistribution(5000000n);

// Get yield share for rank 1
const rank1Share = getYieldShareForRank(1, 5000000n);
console.log(`Rank 1 earns: ${formatBTC(rank1Share.amountSatoshis)}`);
```

---

## ⚡ starkzap Integration

[starkzap](https://www.npmjs.com/package/starkzap) is the official SDK for Starknet wallet and staking operations.

### Installation

```bash
npm install starkzap
```

### Wallet Connection

```typescript
import { StarkZap, OnboardStrategy } from 'starkzap';

const sdk = new StarkZap({ network: 'mainnet' });

// Connect with Cartridge Controller (recommended)
const { wallet } = await sdk.onboard({
  strategy: OnboardStrategy.Cartridge,
  deploy: 'if_needed',
});

console.log('Connected:', wallet.address);
```

### BTC Balance & Transfers

```typescript
import { mainnetTokens, Amount, fromAddress } from 'starkzap';

const BTC = mainnetTokens.BTC;

// Get balance
const balance = await wallet.balanceOf(BTC);
console.log(balance.toFormatted()); // "0.005 BTC"

// Transfer BTC
const tx = await wallet.transfer(BTC, [
  { to: fromAddress('0x123...'), amount: Amount.parse('0.001', BTC) },
]);
await tx.wait();
```

### BTC Staking (Endurance)

```typescript
// Stake BTC via Endurance validator (~5% APY)
const stakeTx = await sdk.stake(
  Amount.parse('0.01', BTC).toBigInt(),
  { validator: 'ENDURANCE' }
);

// Unstake
const unstakeTx = await sdk.unstake(
  Amount.parse('0.01', BTC).toBigInt(),
  { validator: 'ENDURANCE' }
);
```

### Full Integration Example

```typescript
// src/lib/starkzap-client.ts
import { 
  StarkZap, 
  OnboardStrategy, 
  StarkSigner, 
  Amount, 
  fromAddress,
  mainnetTokens 
} from 'starkzap';

export class InfiniYieldSDK {
  private starkzap: StarkZap;
  private wallet: Wallet | null = null;

  constructor(network: 'mainnet' | 'sepolia' = 'mainnet') {
    this.starkzap = new StarkZap({ network });
  }

  async connectWallet() {
    const result = await this.starkzap.onboard({
      strategy: OnboardStrategy.Cartridge,
      deploy: 'if_needed',
    });
    this.wallet = result.wallet;
    return this.wallet;
  }

  async payEntryFee(
    vaultAddress: string,
    platformAddress: string,
    amountBTC: string,
  ) {
    if (!this.wallet) throw new Error('Not connected');
    
    const BTC = mainnetTokens.BTC;
    const total = Amount.parse(amountBTC, BTC);
    
    // 90/10 split
    const vaultAmount = total.toBigInt() * 90n / 100n;
    const platformAmount = total.toBigInt() * 10n / 100n;

    const tx = await this.wallet.transfer(BTC, [
      { to: fromAddress(vaultAddress), amount: Amount.fromBigInt(vaultAmount, BTC) },
      { to: fromAddress(platformAddress), amount: Amount.fromBigInt(platformAmount, BTC) },
    ]);

    await tx.wait();
    return tx.transactionHash;
  }

  async stakeVaultBTC(amountBTC: string) {
    const amount = Amount.parse(amountBTC, mainnetTokens.BTC);
    const tx = await this.starkzap.stake(amount.toBigInt(), {
      validator: 'ENDURANCE',
    });
    return tx.transactionHash;
  }
}
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
# Network: mainnet or sepolia
NEXT_PUBLIC_NETWORK=mainnet

# Platform fee recipient (10%)
NEXT_PUBLIC_PLATFORM_FEE_RECIPIENT=0xYOUR_ADDRESS

# Vault contract (after deployment)
NEXT_PUBLIC_VAULT_CONTRACT=0xYOUR_VAULT

# Cartridge namespace
NEXT_PUBLIC_CARTRIDGE_NAMESPACE=infiniyield
```

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/spiritclawd/infiniyield)

---

## 📁 Project Structure

```
infiniyield/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Styles
│   ├── lib/
│   │   ├── starkzap-client.ts  # starkzap integration
│   │   └── money-flow.ts       # Fee/yield calculations
│   └── store/
│       └── game-store.ts       # Zustand state
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Infinite Vault** | Principal never decreases, only grows |
| **BTC Native** | Primary vault asset is Bitcoin |
| **90/10 Split** | Fair fee distribution |
| **Tiered Rewards** | Top 50% share yield |
| **Time-Weighted** | Maintain position for bonus |
| **Gasless UX** | Via Cartridge Controller |

---

## 📊 Yield Tiers

| Tier | Rank | Share | Example (1 BTC yield) |
|------|------|-------|----------------------|
| 🥇 Gold | Top 1 | 30% | 0.3 BTC |
| 🥈 Silver | Top 2-5 | 25% | 0.0625 BTC each |
| 🥉 Bronze | Top 6-10 | 20% | 0.04 BTC each |
| 💜 Purple | Top 11-25 | 15% | 0.01 BTC each |
| 💙 Blue | Top 26-50 | 10% | 0.004 BTC each |

---

## 🎮 Supported Games

| Game | Status | Entry Fee |
|------|--------|-----------|
| [Loot Survivor](https://lootsurvivor.realms.world) | ✅ Live | 0.001-0.01 BTC |
| Axis Arena | 🔄 Coming Soon | TBD |
| Custom EGS Games | 🔄 Integration | TBD |

---

## 🛡️ Security

- **No private keys stored** - All wallet ops via Cartridge Controller
- **Audited contracts** - Endurance staking is battle-tested
- **Transparent fees** - All splits visible on-chain
- **Non-custodial** - Players control their funds

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 🔗 Links

- **Live Demo**: [infiniyield.vercel.app](https://infiniyield.vercel.app)
- **GitHub**: [github.com/spiritclawd/infiniyield](https://github.com/spiritclawd/infiniyield)
- **starkzap Docs**: [docs.starknet.io/build/starkzap](https://docs.starknet.io/build/starkzap)
- **Endurance**: [endurance.starknet.io](https://endurance.starknet.io)
- **Cartridge**: [cartridge.gg](https://cartridge.gg)

---

## 🏆 Dojo Game Jam VIII

INFINIYIELD is a submission for the Dojo Game Jam VIII. It demonstrates:

- ✅ EGS (Embeddable Game Standard) compatibility
- ✅ On-chain state management
- ✅ Real yield generation
- ✅ Player incentive alignment
- ✅ Sustainable tokenomics (no inflation)

---

Built with ⚡ by [spiritclawd](https://github.com/spiritclawd) | Powered by Starknet + starkzap
