/**
 * INFINIYIELD — Game Store
 *
 * Zustand store mirroring on-chain state from VaultCore.cairo.
 * All amounts in satoshis (bigint). No entry fees, no game runs.
 * This is a yield competition, not a game platform.
 */

import { create } from 'zustand';

// =====================================================================
//  Types (mirror VaultCore structs)
// =====================================================================

/** Mirrors DepositorInfo in i_vault.cairo */
export interface DepositorInfo {
  principal: bigint;       // wBTC locked, sats — NEVER decreases
  t_effective: bigint;     // time score ×100, resets each season
  score: bigint;           // principal × t_effective / 100
  claimable_yield: bigint; // accumulated yield ready to claim, sats
  last_update_block: bigint;
  last_claim_block: bigint;
}

/** Mirrors LeaderboardEntry in i_vault.cairo */
export interface LeaderboardEntry {
  rank: number;
  addr: string;
  score: bigint;
  principal?: bigint;      // enriched client-side from depositor_info
}

export interface SeasonState {
  seasonNumber: bigint;
  seasonStartBlock: bigint;
  currentBlock: bigint;
  yieldPool: bigint;       // accumulated yield for this season, sats
  totalDeposited: bigint;  // total wBTC locked, sats
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  wbtcBalance: bigint;     // sats
  iyBalance: bigint;       // IY tokens (1e18 units)
  loading: boolean;
}

export interface TxState {
  pending: boolean;
  hash: string | null;
  error: string | null;
}

// =====================================================================
//  Store Interface
// =====================================================================

export interface VaultStore {
  // Wallet
  wallet: WalletState;

  // On-chain season data
  season: SeasonState;

  // Current user's depositor info (null if not deposited)
  depositorInfo: DepositorInfo | null;

  // Top-10 leaderboard
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;

  // Pending transaction state
  tx: TxState;

  // Last data refresh timestamp (ms)
  lastRefreshed: number | null;

  // Actions
  setWallet: (w: Partial<WalletState>) => void;
  disconnectWallet: () => void;
  setSeason: (s: Partial<SeasonState>) => void;
  setDepositorInfo: (info: DepositorInfo | null) => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setLeaderboardLoading: (loading: boolean) => void;
  setTx: (tx: Partial<TxState>) => void;
  clearTx: () => void;
  setLastRefreshed: (ts: number) => void;
}

// =====================================================================
//  Store
// =====================================================================

const defaultWallet: WalletState = {
  connected: false,
  address: null,
  wbtcBalance: 0n,
  iyBalance: 0n,
  loading: false,
};

const defaultSeason: SeasonState = {
  seasonNumber: 0n,
  seasonStartBlock: 0n,
  currentBlock: 0n,
  yieldPool: 0n,
  totalDeposited: 0n,
};

export const useVaultStore = create<VaultStore>((set) => ({
  wallet: defaultWallet,
  season: defaultSeason,
  depositorInfo: null,
  leaderboard: [],
  leaderboardLoading: false,
  tx: { pending: false, hash: null, error: null },
  lastRefreshed: null,

  setWallet: (w) =>
    set((s) => ({ wallet: { ...s.wallet, ...w } })),

  disconnectWallet: () =>
    set({ wallet: defaultWallet, depositorInfo: null }),

  setSeason: (s) =>
    set((prev) => ({ season: { ...prev.season, ...s } })),

  setDepositorInfo: (info) => set({ depositorInfo: info }),

  setLeaderboard: (entries) => set({ leaderboard: entries }),

  setLeaderboardLoading: (loading) => set({ leaderboardLoading: loading }),

  setTx: (tx) =>
    set((s) => ({ tx: { ...s.tx, ...tx } })),

  clearTx: () =>
    set({ tx: { pending: false, hash: null, error: null } }),

  setLastRefreshed: (ts) => set({ lastRefreshed: ts }),
}));
