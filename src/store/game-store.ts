/**
 * INFINIYIELD - Game Store
 *
 * Zustand store for managing:
 * - Wallet connection state
 * - Vault data
 * - Leaderboard entries
 * - Active game runs
 */

import { create } from 'zustand';

// Types
export interface Vault {
  id: string;
  name: string;
  asset: 'BTC' | 'ETH' | 'USDC';
  totalPrincipal: bigint;
  accumulatedYield: bigint;
  apy: number;
  active: boolean;
}

export interface GameRun {
  id: string;
  gameId: string;
  gameName: string;
  vaultId: string;
  entryFee: bigint;
  playerCount: number;
  startTime: number;
  endTime: number | null;
  active: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  score: number;
  entries: number;
  totalFeesPaid: bigint;
  yieldShare: number;
  joinedAt: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  btcBalance: bigint;
  loading: boolean;
}

export interface GameState {
  // Wallet
  wallet: WalletState;
  
  // Vaults
  vaults: Vault[];
  selectedVaultId: string | null;
  
  // Game Runs
  activeRuns: GameRun[];
  selectedRunId: string | null;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;
  
  // Actions
  setWallet: (wallet: Partial<WalletState>) => void;
  disconnectWallet: () => void;
  
  setVaults: (vaults: Vault[]) => void;
  selectVault: (vaultId: string) => void;
  
  setActiveRuns: (runs: GameRun[]) => void;
  selectRun: (runId: string) => void;
  
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setLeaderboardLoading: (loading: boolean) => void;
  
  updateVaultStats: (vaultId: string, stats: Partial<Vault>) => void;
}

// Mock data for development
const mockVaults: Vault[] = [
  {
    id: 'btc-1',
    name: 'BTC Vault',
    asset: 'BTC',
    totalPrincipal: 1500000000n, // 15 BTC
    accumulatedYield: 75000000n,  // 0.75 BTC
    apy: 0.052,
    active: true,
  },
  {
    id: 'eth-1',
    name: 'ETH Vault',
    asset: 'ETH',
    totalPrincipal: 0n,
    accumulatedYield: 0n,
    apy: 0.04,
    active: false,
  },
];

const mockRuns: GameRun[] = [
  {
    id: 'run-1',
    gameId: 'loot-survivor',
    gameName: 'Loot Survivor',
    vaultId: 'btc-1',
    entryFee: 100000n, // 0.001 BTC
    playerCount: 847,
    startTime: Date.now() - 86400000 * 3, // 3 days ago
    endTime: Date.now() + 86400000 * 4, // 4 days remaining
    active: true,
  },
  {
    id: 'run-2',
    gameId: 'loot-survivor',
    gameName: 'Loot Survivor Pro',
    vaultId: 'btc-1',
    entryFee: 500000n, // 0.005 BTC
    playerCount: 156,
    startTime: Date.now() - 86400000, // 1 day ago
    endTime: Date.now() + 86400000 * 6, // 6 days remaining
    active: true,
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, address: '0x1234...abcd', score: 99847, entries: 12, totalFeesPaid: 1200000n, yieldShare: 30, joinedAt: Date.now() - 86400000 * 2 },
  { rank: 2, address: '0x5678...efgh', score: 98523, entries: 8, totalFeesPaid: 800000n, yieldShare: 6.25, joinedAt: Date.now() - 86400000 },
  { rank: 3, address: '0x9abc...ijkl', score: 97214, entries: 15, totalFeesPaid: 1500000n, yieldShare: 6.25, joinedAt: Date.now() - 86400000 * 3 },
  { rank: 4, address: '0xdef0...mnop', score: 95876, entries: 6, totalFeesPaid: 600000n, yieldShare: 5, joinedAt: Date.now() - 86400000 },
  { rank: 5, address: '0x2222...qrst', score: 94123, entries: 10, totalFeesPaid: 1000000n, yieldShare: 5, joinedAt: Date.now() - 86400000 * 2 },
  { rank: 6, address: '0x3333...uvwx', score: 92847, entries: 7, totalFeesPaid: 700000n, yieldShare: 4, joinedAt: Date.now() - 86400000 },
  { rank: 7, address: '0x4444...yz01', score: 91562, entries: 9, totalFeesPaid: 900000n, yieldShare: 4, joinedAt: Date.now() - 86400000 * 4 },
  { rank: 8, address: '0x5555...2345', score: 90234, entries: 5, totalFeesPaid: 500000n, yieldShare: 4, joinedAt: Date.now() - 86400000 * 2 },
  { rank: 9, address: '0x6666...6789', score: 89456, entries: 11, totalFeesPaid: 1100000n, yieldShare: 4, joinedAt: Date.now() - 86400000 * 3 },
  { rank: 10, address: '0x7777...abcd', score: 88123, entries: 4, totalFeesPaid: 400000n, yieldShare: 4, joinedAt: Date.now() - 86400000 },
];

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  wallet: {
    connected: false,
    address: null,
    btcBalance: 0n,
    loading: false,
  },
  vaults: mockVaults,
  selectedVaultId: 'btc-1',
  activeRuns: mockRuns,
  selectedRunId: 'run-1',
  leaderboard: mockLeaderboard,
  leaderboardLoading: false,
  
  // Actions
  setWallet: (wallet) =>
    set((state) => ({
      wallet: { ...state.wallet, ...wallet },
    })),
    
  disconnectWallet: () =>
    set({
      wallet: {
        connected: false,
        address: null,
        btcBalance: 0n,
        loading: false,
      },
    }),
    
  setVaults: (vaults) => set({ vaults }),
  
  selectVault: (vaultId) => set({ selectedVaultId: vaultId }),
  
  setActiveRuns: (runs) => set({ activeRuns: runs }),
  
  selectRun: (runId) => set({ selectedRunId: runId }),
  
  setLeaderboard: (entries) => set({ leaderboard: entries }),
  
  setLeaderboardLoading: (loading) => set({ leaderboardLoading: loading }),
  
  updateVaultStats: (vaultId, stats) =>
    set((state) => ({
      vaults: state.vaults.map((v) =>
        v.id === vaultId ? { ...v, ...stats } : v
      ),
    })),
}));

export default useGameStore;
