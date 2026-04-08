/**
 * INFINIYIELD — Money Flow Logic
 *
 * Matches VaultCore.cairo exactly. Single source of truth.
 *
 * === YIELD SPLIT (per season) ===
 *   70% → top 10 depositors, quadratic: (11-rank)² / 385
 *   20% → all depositors, pro-rata by wBTC principal
 *   10% → treasury
 *
 * === SCORING ===
 *   score = principal_sats × t_effective_scaled / 100
 *   t_effective accumulates per block (tiered decay over 90 days)
 *
 * === CLAIM ===
 *   1% fee, 24h cooldown (43200 blocks), min 1000 sats
 */

// =====================================================================
//  CONTRACT CONSTANTS (mirror of vault_core.cairo)
// =====================================================================

export const CONTRACT = {
  SEASON_BLOCKS: 100n,            // testing; production: 2_592_000n (~60 days)
  BLOCKS_PER_DAY: 43200n,         // Sepolia: ~2s per block
  CLAIM_COOLDOWN_BLOCKS: 43200n,  // 24h
  MIN_CLAIM_SATS: 1000n,          // minimum claimable
  CLAIM_FEE_BPS: 100n,            // 1%
  BPS_DENOM: 10000n,
  IY_PER_1000_SATS: 1_000_000_000_000_000_000n, // 1e18

  // Yield split (integer percentages)
  YIELD_TOP10_PCT: 70n,
  YIELD_DEPOSITORS_PCT: 20n,
  YIELD_TREASURY_PCT: 10n,
  PCT_DENOM: 100n,

  // Scoring t_effective tiers
  DAY_45: 45n,
  DAY_90: 90n,
  RATE_TIER1: 100n,  // days 1-45: +100 per day
  RATE_TIER2: 70n,   // days 46-90: +70 per day
  RATE_TIER3: 40n,   // days 91+:   +40 per day
} as const;

// Leaderboard quadratic denominator: Σ (11-rank)² for rank 1..10 = 385
export const RANK_SUM = 385n;
export const MAX_RANK = 10;

// =====================================================================
//  YIELD DISTRIBUTION
// =====================================================================

export interface RankYieldShare {
  rank: number;
  /** Quadratic numerator: (11-rank)² */
  numerator: bigint;
  /** Fraction of the 70% top-10 pool this rank earns */
  fractionOfTop10: number;
  /** Fraction of total yield pool */
  fractionOfTotal: number;
  /** Human-readable percentage of total yield */
  pctLabel: string;
  /** Amount in sats given a total yield pool */
  amountSatoshis: bigint;
}

/**
 * Returns yield share data for each rank 1..10 (or up to lb_size).
 * Mirrors distribute_yield_pool() in vault_core.cairo.
 *
 * @param totalYieldPool  Total yield pool in sats (100% before split)
 * @param lbSize          Number of active leaderboard entries (max 10)
 */
export function getTop10YieldShares(
  totalYieldPool: bigint,
  lbSize: number = MAX_RANK,
): RankYieldShare[] {
  const top10Pool = (totalYieldPool * CONTRACT.YIELD_TOP10_PCT) / CONTRACT.PCT_DENOM;
  const effectiveSize = Math.min(lbSize, MAX_RANK);
  const shares: RankYieldShare[] = [];

  for (let rank = 1; rank <= effectiveSize; rank++) {
    const numerator = BigInt((11 - rank) ** 2);
    const amountSatoshis = (top10Pool * numerator) / RANK_SUM;
    const fractionOfTop10 = Number(numerator) / Number(RANK_SUM);
    const fractionOfTotal = fractionOfTop10 * 0.7; // top10 pool is 70% of total

    shares.push({
      rank,
      numerator,
      fractionOfTop10,
      fractionOfTotal,
      pctLabel: `${(fractionOfTotal * 100).toFixed(2)}%`,
      amountSatoshis,
    });
  }

  return shares;
}

/**
 * Yield share for a single rank (returns null if rank > 10).
 */
export function getYieldShareForRank(
  rank: number,
  totalYieldPool: bigint,
  lbSize: number = MAX_RANK,
): RankYieldShare | null {
  if (rank < 1 || rank > Math.min(lbSize, MAX_RANK)) return null;
  return getTop10YieldShares(totalYieldPool, lbSize)[rank - 1];
}

/**
 * Pro-rata yield share for a depositor from the 20% pool.
 *
 * @param principalSats      This depositor's locked principal
 * @param totalDepositedSats Total wBTC locked in vault
 * @param totalYieldPool     Total yield pool for the season
 */
export function getDepositorProRataShare(
  principalSats: bigint,
  totalDepositedSats: bigint,
  totalYieldPool: bigint,
): bigint {
  if (totalDepositedSats === 0n) return 0n;
  const depositorPool = (totalYieldPool * CONTRACT.YIELD_DEPOSITORS_PCT) / CONTRACT.PCT_DENOM;
  return (depositorPool * principalSats) / totalDepositedSats;
}

// =====================================================================
//  SCORING
// =====================================================================

/**
 * Compute score: principal_sats × t_effective_scaled / 100
 * Matches compute_score_for() in vault_core.cairo.
 */
export function computeScore(principalSats: bigint, tEffective: bigint): bigint {
  if (tEffective === 0n || principalSats === 0n) return 0n;
  return (principalSats * tEffective) / 100n;
}

// =====================================================================
//  CLAIM
// =====================================================================

export interface ClaimBreakdown {
  gross: bigint;
  fee: bigint;
  net: bigint;
  feePercent: number;
  canClaim: boolean;
  reason?: string;
}

/**
 * Breakdown for a yield claim. Mirrors claim_yield() in vault_core.cairo.
 */
export function getClaimBreakdown(
  claimableYield: bigint,
  currentBlock: bigint,
  lastClaimBlock: bigint,
): ClaimBreakdown {
  if (claimableYield < CONTRACT.MIN_CLAIM_SATS) {
    return {
      gross: claimableYield,
      fee: 0n,
      net: 0n,
      feePercent: 1,
      canClaim: false,
      reason: `Minimum claim is 1,000 sats (you have ${claimableYield} sats)`,
    };
  }

  const cooldownPassed =
    lastClaimBlock === 0n ||
    currentBlock >= lastClaimBlock + CONTRACT.CLAIM_COOLDOWN_BLOCKS;

  if (!cooldownPassed) {
    const blocksLeft = lastClaimBlock + CONTRACT.CLAIM_COOLDOWN_BLOCKS - currentBlock;
    const hoursLeft = Number(blocksLeft) / Number(CONTRACT.BLOCKS_PER_DAY) * 24;
    return {
      gross: claimableYield,
      fee: 0n,
      net: 0n,
      feePercent: 1,
      canClaim: false,
      reason: `Cooldown active — ${hoursLeft.toFixed(1)}h remaining`,
    };
  }

  const fee = (claimableYield * CONTRACT.CLAIM_FEE_BPS) / CONTRACT.BPS_DENOM;
  return {
    gross: claimableYield,
    fee,
    net: claimableYield - fee,
    feePercent: 1,
    canClaim: true,
  };
}

// =====================================================================
//  IY TOKENS
// =====================================================================

/**
 * IY tokens minted on deposit: 1 IY (1e18) per 1000 sats.
 */
export function getIYMintAmount(depositSats: bigint): bigint {
  return (depositSats / 1000n) * CONTRACT.IY_PER_1000_SATS;
}

// =====================================================================
//  SEASON
// =====================================================================

export interface SeasonProgress {
  blocksElapsed: bigint;
  blocksTotal: bigint;
  blocksRemaining: bigint;
  percentComplete: number;
  isOver: boolean;
}

export function getSeasonProgress(
  currentBlock: bigint,
  seasonStartBlock: bigint,
): SeasonProgress {
  const blocksElapsed = currentBlock > seasonStartBlock
    ? currentBlock - seasonStartBlock
    : 0n;
  const blocksTotal = CONTRACT.SEASON_BLOCKS;
  const blocksRemaining = blocksElapsed >= blocksTotal
    ? 0n
    : blocksTotal - blocksElapsed;
  const percentComplete = Math.min(
    Number((blocksElapsed * 100n) / blocksTotal),
    100,
  );

  return {
    blocksElapsed,
    blocksTotal,
    blocksRemaining,
    percentComplete,
    isOver: blocksElapsed >= blocksTotal,
  };
}

// =====================================================================
//  FORMATTING HELPERS
// =====================================================================

/** 1 BTC = 100,000,000 sats */
export function satoshisToBTC(satoshis: bigint): string {
  const btc = Number(satoshis) / 1e8;
  if (btc === 0) return '0.00000000';
  if (btc < 0.001) return btc.toFixed(8);
  return btc.toFixed(6);
}

export function formatBTC(satoshis: bigint): string {
  return `${satoshisToBTC(satoshis)} BTC`;
}

export function formatSats(satoshis: bigint): string {
  return `${satoshis.toLocaleString()} sats`;
}

export function formatBTCInput(btcString: string): bigint {
  const btc = parseFloat(btcString);
  if (isNaN(btc) || btc <= 0) return 0n;
  return BigInt(Math.floor(btc * 1e8));
}

export function formatScore(score: bigint): string {
  if (score === 0n) return '0';
  if (score > 1_000_000_000n) return `${(Number(score) / 1e9).toFixed(2)}B`;
  if (score > 1_000_000n) return `${(Number(score) / 1e6).toFixed(2)}M`;
  if (score > 1_000n) return `${(Number(score) / 1e3).toFixed(2)}K`;
  return score.toString();
}

export function formatUSD(satoshis: bigint, btcPriceUSD: number): string {
  const btc = Number(satoshis) / 1e8;
  const usd = btc * btcPriceUSD;
  return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// =====================================================================
//  VESU YIELD ESTIMATION
//  Real data from api.vesu.xyz/markets (Prime Pool, Starknet Mainnet)
//  WBTC Supply APY: 0.14% | SolvBTC BTCFi APR (Clearstar): 2.00%
//  We use 2.0% as our reference rate (conservative BTC lending yield)
// =====================================================================

/** Real Vesu wBTC APY — Prime Pool on Starknet: 0.14% annualized supply APY.
 *  For a more realistic demo (SolvBTC BTCFi / Clearstar Reactor): 2.00%.
 *  We expose the conservative mainnet number here. */
export const VESU_WBTC_APY = 0.0014; // 0.14% annually (Vesu Prime Pool, real data)

/** Vesu SolvBTC BTCFi APY for reference (Clearstar Reactor): 2.00% */
export const VESU_SOLVBTC_APY = 0.02;

/**
 * Estimate yield earned on a BTC principal over N days at Vesu APY.
 *
 * @param principalSats  Deposited amount in satoshis
 * @param days           Number of days deposited
 * @returns              Estimated yield in satoshis (floor-rounded)
 */
export function estimateVesuYield(principalSats: bigint, days: number): bigint {
  if (principalSats === 0n || days === 0) return 0n;
  const dailyRate = VESU_WBTC_APY / 365;
  const yieldBtc = Number(principalSats) * dailyRate * days;
  return BigInt(Math.floor(yieldBtc));
}

/**
 * Format APY as a human-readable percentage string.
 * e.g. 0.0014 → "0.14%"
 */
export function formatAPY(apy: number): string {
  return `${(apy * 100).toFixed(2)}%`;
}
