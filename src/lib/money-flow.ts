/**
 * INFINIYIELD - Money Flow Logic
 *
 * This module handles the core financial operations:
 * - Fee splitting (90% vault / 10% platform)
 * - Yield distribution to top players
 * - Time-weighted claim calculations
 */

// Basis points denominator (10000 = 100%)
const BPS_DENOMINATOR = 10000n;

// Fee split percentages
export const FEE_SPLIT = {
  VAULT_BPS: 9000n,     // 90%
  PLATFORM_BPS: 1000n,  // 10%
} as const;

// Yield distribution tiers
export const YIELD_TIERS = [
  { maxRank: 1, shareBps: 3000n, label: 'Top 1' },     // 30%
  { maxRank: 5, shareBps: 2500n, label: 'Top 2-5' },    // 25%
  { maxRank: 10, shareBps: 2000n, label: 'Top 6-10' },  // 20%
  { maxRank: 25, shareBps: 1500n, label: 'Top 11-25' }, // 15%
  { maxRank: 50, shareBps: 1000n, label: 'Top 26-50' }, // 10%
] as const;

/**
 * Result of fee split calculation
 */
export interface FeeSplitResult {
  totalAmount: bigint;
  vaultAmount: bigint;
  platformAmount: bigint;
  vaultPercentage: number;
  platformPercentage: number;
}

/**
 * Calculate the fee split for an entry fee
 * 
 * @param amountSatoshis - Entry fee in satoshis (1 BTC = 100,000,000 satoshis)
 * @returns FeeSplitResult with vault and platform amounts
 * 
 * @example
 * ```typescript
 * const split = calculateFeeSplit(100000n); // 0.001 BTC
 * console.log(split.vaultAmount);   // 90000n (90%)
 * console.log(split.platformAmount); // 10000n (10%)
 * ```
 */
export function calculateFeeSplit(amountSatoshis: bigint): FeeSplitResult {
  const vaultAmount = (amountSatoshis * FEE_SPLIT.VAULT_BPS) / BPS_DENOMINATOR;
  const platformAmount = (amountSatoshis * FEE_SPLIT.PLATFORM_BPS) / BPS_DENOMINATOR;

  return {
    totalAmount: amountSatoshis,
    vaultAmount,
    platformAmount,
    vaultPercentage: Number(FEE_SPLIT.VAULT_BPS) / 100,
    platformPercentage: Number(FEE_SPLIT.PLATFORM_BPS) / 100,
  };
}

/**
 * Calculate fee split from BTC decimal string
 */
export function calculateFeeSplitFromBTC(btcAmount: string): FeeSplitResult {
  const satoshis = btcToSatoshis(btcAmount);
  return calculateFeeSplit(satoshis);
}

/**
 * Yield distribution for a player
 */
export interface YieldShare {
  rank: number;
  shareBps: bigint;
  percentage: number;
  amountSatoshis: bigint;
}

/**
 * Calculate yield distribution for all tiers
 * 
 * @param totalYieldSatoshis - Total yield to distribute
 * @returns Array of yield shares by tier
 */
export function calculateYieldDistribution(totalYieldSatoshis: bigint): YieldShare[] {
  const distributions: YieldShare[] = [];
  
  for (const tier of YIELD_TIERS) {
    const amount = (totalYieldSatoshis * tier.shareBps) / BPS_DENOMINATOR;
    distributions.push({
      rank: tier.maxRank,
      shareBps: tier.shareBps,
      percentage: Number(tier.shareBps) / 100,
      amountSatoshis: amount,
    });
  }
  
  return distributions;
}

/**
 * Get yield share for a specific rank
 */
export function getYieldShareForRank(
  rank: number,
  totalYieldSatoshis: bigint,
): YieldShare | null {
  for (let i = 0; i < YIELD_TIERS.length; i++) {
    const tier = YIELD_TIERS[i];
    const prevMaxRank = i > 0 ? YIELD_TIERS[i - 1].maxRank : 0;
    
    if (rank <= tier.maxRank && rank > prevMaxRank) {
      const amount = (totalYieldSatoshis * tier.shareBps) / BPS_DENOMINATOR;
      
      // Distribute evenly within tier
      const playersInTier = BigInt(tier.maxRank - prevMaxRank);
      const amountPerPlayer = amount / playersInTier;
      
      return {
        rank,
        shareBps: tier.shareBps / BigInt(tier.maxRank - prevMaxRank),
        percentage: Number(tier.shareBps) / 100 / (tier.maxRank - prevMaxRank),
        amountSatoshis: amountPerPlayer,
      };
    }
  }
  
  return null; // Rank outside top 50%
}

/**
 * Time-weighted claim multiplier
 * Players must maintain position to maximize claims
 */
export function calculateTimeWeightedClaim(
  baseAmount: bigint,
  daysInPosition: number,
  maxMultiplier: number = 2.0,
): bigint {
  // Linear scaling from 1x to maxMultiplier over 30 days
  const maxDays = 30;
  const multiplier = Math.min(1 + (daysInPosition / maxDays) * (maxMultiplier - 1), maxMultiplier);
  
  return (baseAmount * BigInt(Math.floor(multiplier * 100))) / 100n;
}

/**
 * Convert BTC to satoshis
 */
export function btcToSatoshis(btc: string): bigint {
  const btcNum = parseFloat(btc);
  return BigInt(Math.floor(btcNum * 100_000_000));
}

/**
 * Convert satoshis to BTC string
 */
export function satoshisToBTC(satoshis: bigint): string {
  const btc = Number(satoshis) / 100_000_000;
  return btc.toFixed(8);
}

/**
 * Format satoshis for display (e.g., "0.001 BTC")
 */
export function formatBTC(satoshis: bigint): string {
  return `${satoshisToBTC(satoshis)} BTC`;
}

/**
 * Format USD value given BTC price
 */
export function formatUSD(satoshis: bigint, btcPriceUSD: number): string {
  const btc = Number(satoshis) / 100_000_000;
  const usd = btc * btcPriceUSD;
  return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Calculate APY display
 */
export function formatAPY(apy: number): string {
  return `${(apy * 100).toFixed(2)}% APY`;
}

/**
 * Project vault growth over time
 */
export function projectVaultGrowth(
  initialPrincipal: bigint,
  dailyEntryFees: bigint,
  apy: number,
  days: number,
): {
  principal: bigint;
  totalYield: bigint;
  totalValue: bigint;
} {
  // Simple projection (doesn't account for compounding perfectly)
  const dailyYieldRate = apy / 365;
  
  let principal = initialPrincipal;
  let totalYield = 0n;
  
  for (let day = 0; day < days; day++) {
    // Add entry fees
    principal += dailyEntryFees;
    
    // Calculate daily yield on principal
    const dailyYield = (principal * BigInt(Math.floor(dailyYieldRate * 10000))) / 10000n;
    totalYield += dailyYield;
  }
  
  return {
    principal,
    totalYield,
    totalValue: principal + totalYield,
  };
}

/**
 * Vault statistics
 */
export interface VaultStats {
  totalPrincipal: bigint;
  accumulatedYield: bigint;
  totalValue: bigint;
  totalEntries: number;
  uniquePlayers: number;
  apy: number;
}

/**
 * Create default vault stats
 */
export function createVaultStats(overrides: Partial<VaultStats> = {}): VaultStats {
  return {
    totalPrincipal: 0n,
    accumulatedYield: 0n,
    totalValue: 0n,
    totalEntries: 0,
    uniquePlayers: 0,
    apy: 0.05,
    ...overrides,
  };
}
