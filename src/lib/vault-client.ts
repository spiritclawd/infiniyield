/**
 * INFINIYIELD — Vault Client
 *
 * Handles all on-chain reads and writes to VaultCore.cairo on Starknet.
 * Uses starkzap for wallet/signer, starknet.js v9 for contract calls.
 *
 * Contract addresses are read from env at runtime — set them after deploy.
 */

import {
  StarkZap,
  StarkSigner,
  OnboardStrategy,
  type WalletInterface,
} from 'starkzap';
import { Contract, RpcProvider, num, CallData } from 'starknet';

import type { DepositorInfo, LeaderboardEntry } from '@/store/game-store';

// =====================================================================
//  Config
// =====================================================================

export type Network = 'mainnet' | 'sepolia';

const NETWORK = (process.env.NEXT_PUBLIC_NETWORK ?? 'sepolia') as Network;

const RPC_URL =
  NETWORK === 'sepolia'
    ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
    : 'https://starknet.public.blastapi.io/rpc/v0_7';

export const CONTRACT_ADDRESSES = {
  vault:    process.env.NEXT_PUBLIC_VAULT_CONTRACT    ?? '0x0',
  wbtc:     process.env.NEXT_PUBLIC_WBTC_CONTRACT     ?? '0x0',
  iyToken:  process.env.NEXT_PUBLIC_IY_TOKEN_CONTRACT ?? '0x0',
  treasury: process.env.NEXT_PUBLIC_TREASURY_ADDRESS  ?? '0x0',
};

// =====================================================================
//  ABIs (minimal — only what the UI needs)
// =====================================================================

const VAULT_ABI = [
  // Views
  { type: 'function', name: 'get_score',            inputs: [{ name: 'addr', type: 'core::starknet::contract_address::ContractAddress' }], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
  { type: 'function', name: 'get_leaderboard',      inputs: [], outputs: [{ type: 'core::array::Array::<infiniyield::interfaces::i_vault::LeaderboardEntry>' }], state_mutability: 'view' },
  { type: 'function', name: 'get_depositor_info',   inputs: [{ name: 'addr', type: 'core::starknet::contract_address::ContractAddress' }], outputs: [{ type: 'infiniyield::interfaces::i_vault::DepositorInfo' }], state_mutability: 'view' },
  { type: 'function', name: 'get_season_number',    inputs: [], outputs: [{ type: 'core::integer::u64' }], state_mutability: 'view' },
  { type: 'function', name: 'get_season_start_block', inputs: [], outputs: [{ type: 'core::integer::u64' }], state_mutability: 'view' },
  { type: 'function', name: 'get_season_yield_pool', inputs: [], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
  { type: 'function', name: 'get_total_deposited',  inputs: [], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
  { type: 'function', name: 'get_current_block',    inputs: [], outputs: [{ type: 'core::integer::u64' }], state_mutability: 'view' },
  // Write
  { type: 'function', name: 'deposit',              inputs: [{ name: 'amount', type: 'core::integer::u256' }], outputs: [], state_mutability: 'external' },
  { type: 'function', name: 'harvest_and_distribute', inputs: [], outputs: [], state_mutability: 'external' },
  { type: 'function', name: 'claim_yield',          inputs: [], outputs: [], state_mutability: 'external' },
  { type: 'function', name: 'end_season',           inputs: [], outputs: [], state_mutability: 'external' },
] as const;

const ERC20_ABI = [
  { type: 'function', name: 'balance_of', inputs: [{ name: 'account', type: 'core::starknet::contract_address::ContractAddress' }], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
  { type: 'function', name: 'approve',    inputs: [{ name: 'spender', type: 'core::starknet::contract_address::ContractAddress' }, { name: 'amount', type: 'core::integer::u256' }], outputs: [{ type: 'core::bool' }], state_mutability: 'external' },
] as const;

const MOCK_WBTC_ABI = [
  ...ERC20_ABI,
  { type: 'function', name: 'mint', inputs: [{ name: 'to', type: 'core::starknet::contract_address::ContractAddress' }, { name: 'amount', type: 'core::integer::u256' }], outputs: [], state_mutability: 'external' },
] as const;

// =====================================================================
//  Provider (read-only)
// =====================================================================

let _provider: RpcProvider | null = null;
export function getProvider(): RpcProvider {
  if (!_provider) _provider = new RpcProvider({ nodeUrl: RPC_URL });
  return _provider;
}

// =====================================================================
//  Read Functions (no wallet needed)
// =====================================================================

function vaultReadContract(): Contract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Contract({ abi: VAULT_ABI as any, address: CONTRACT_ADDRESSES.vault, providerOrAccount: getProvider() });
}

function wbtcReadContract(): Contract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Contract({ abi: MOCK_WBTC_ABI as any, address: CONTRACT_ADDRESSES.wbtc, providerOrAccount: getProvider() });
}

function iyReadContract(): Contract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Contract({ abi: ERC20_ABI as any, address: CONTRACT_ADDRESSES.iyToken, providerOrAccount: getProvider() });
}

// u256 from starknet.js comes back as a bigint directly in v6+
function toBigInt(val: unknown): bigint {
  if (typeof val === 'bigint') return val;
  if (typeof val === 'number') return BigInt(val);
  if (typeof val === 'string') return BigInt(val);
  return 0n;
}

export async function fetchSeasonData() {
  const vault = vaultReadContract();
  const [seasonNumber, seasonStartBlock, yieldPool, totalDeposited, currentBlock] =
    await Promise.all([
      vault.get_season_number(),
      vault.get_season_start_block(),
      vault.get_season_yield_pool(),
      vault.get_total_deposited(),
      vault.get_current_block(),
    ]);

  return {
    seasonNumber:    toBigInt(seasonNumber),
    seasonStartBlock: toBigInt(seasonStartBlock),
    currentBlock:    toBigInt(currentBlock),
    yieldPool:       toBigInt(yieldPool),
    totalDeposited:  toBigInt(totalDeposited),
  };
}

export async function fetchDepositorInfo(address: string): Promise<DepositorInfo> {
  const vault = vaultReadContract();
  const info = await vault.get_depositor_info(address);
  return {
    principal:          toBigInt(info.principal),
    t_effective:        toBigInt(info.t_effective),
    score:              toBigInt(info.score),
    claimable_yield:    toBigInt(info.claimable_yield),
    last_update_block:  toBigInt(info.last_update_block),
    last_claim_block:   toBigInt(info.last_claim_block),
  };
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const vault = vaultReadContract();
  const raw: Array<{ addr: string; score: bigint }> = await vault.get_leaderboard();
  return raw.map((entry, i) => ({
    rank: i + 1,
    addr: num.toHex(entry.addr),
    score: toBigInt(entry.score),
  }));
}

export async function fetchWBTCBalance(address: string): Promise<bigint> {
  const wbtc = wbtcReadContract();
  return toBigInt(await wbtc.balance_of(address));
}

export async function fetchIYBalance(address: string): Promise<bigint> {
  const iy = iyReadContract();
  return toBigInt(await iy.balance_of(address));
}

// =====================================================================
//  Wallet Connection (starkzap)
// =====================================================================

let _starkzap: StarkZap | null = null;

export function getStarkZap(): StarkZap {
  if (!_starkzap) _starkzap = new StarkZap({ network: NETWORK });
  return _starkzap;
}

/**
 * Connect via Cartridge Controller (browser).
 * Returns the wallet address on success.
 */
export async function connectWallet(): Promise<{ address: string; wallet: WalletInterface }> {
  const sdk = getStarkZap();
  const result = await sdk.onboard({
    strategy: OnboardStrategy.Cartridge,
    deploy: 'if_needed',
  });
  return { address: result.wallet.address as string, wallet: result.wallet };
}

// =====================================================================
//  Write Functions (wallet required)
// =====================================================================

// u256 → two-felt calldata (low, high) as expected by Cairo
function u256Calldata(val: bigint): string[] {
  const low = (val & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn).toString();
  const high = (val >> 128n).toString();
  return [low, high];
}

/**
 * Approve wBTC + deposit to vault in a multicall. Amount in satoshis.
 * Returns tx hash.
 */
export async function depositWBTC(
  wallet: WalletInterface,
  amountSats: bigint,
): Promise<string> {
  const tx = await wallet.execute([
    {
      contractAddress: CONTRACT_ADDRESSES.wbtc,
      entrypoint: 'approve',
      calldata: CallData.compile({
        spender: CONTRACT_ADDRESSES.vault,
        amount: { low: (amountSats & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn).toString(), high: (amountSats >> 128n).toString() },
      }),
    },
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'deposit',
      calldata: u256Calldata(amountSats),
    },
  ]);
  const hash = (tx as unknown as { hash: string }).hash ?? (tx as unknown as { transaction_hash: string }).transaction_hash;
  await getProvider().waitForTransaction(hash);
  return hash;
}

/**
 * Claim accumulated yield. Returns tx hash.
 */
export async function claimYield(wallet: WalletInterface): Promise<string> {
  const tx = await wallet.execute([
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'claim_yield',
      calldata: [],
    },
  ]);
  const hash = (tx as unknown as { hash: string }).hash ?? (tx as unknown as { transaction_hash: string }).transaction_hash;
  await getProvider().waitForTransaction(hash);
  return hash;
}

/**
 * Trigger yield harvest from yield source into season pool.
 * Permissionless — anyone can call.
 */
export async function harvestYield(wallet: WalletInterface): Promise<string> {
  const tx = await wallet.execute([
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'harvest_and_distribute',
      calldata: [],
    },
  ]);
  const hash = (tx as unknown as { hash: string }).hash ?? (tx as unknown as { transaction_hash: string }).transaction_hash;
  await getProvider().waitForTransaction(hash);
  return hash;
}

/**
 * End the current season (permissionless after SEASON_BLOCKS elapsed).
 */
export async function endSeason(wallet: WalletInterface): Promise<string> {
  const tx = await wallet.execute([
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'end_season',
      calldata: [],
    },
  ]);
  const hash = (tx as unknown as { hash: string }).hash ?? (tx as unknown as { transaction_hash: string }).transaction_hash;
  await getProvider().waitForTransaction(hash);
  return hash;
}

/**
 * Testnet only — mint mock wBTC for testing.
 */
export async function mintMockWBTC(
  wallet: WalletInterface,
  toAddress: string,
  amountSats: bigint,
): Promise<string> {
  const tx = await wallet.execute([
    {
      contractAddress: CONTRACT_ADDRESSES.wbtc,
      entrypoint: 'mint',
      calldata: CallData.compile({
        to: toAddress,
        amount: { low: (amountSats & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn).toString(), high: (amountSats >> 128n).toString() },
      }),
    },
  ]);
  const hash = (tx as unknown as { hash: string }).hash ?? (tx as unknown as { transaction_hash: string }).transaction_hash;
  await getProvider().waitForTransaction(hash);
  return hash;
}
