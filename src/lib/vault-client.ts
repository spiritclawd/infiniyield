/**
 * INFINIYIELD — Vault Client
 *
 * Wallet: Cartridge Controller (ControllerProvider) — Sepolia
 * Contracts: starknet.js v9 Contract reads, raw invoke writes via controller
 *
 * Contract addresses read from env (baked in at build via next.config.ts).
 */

import ControllerProvider from '@cartridge/controller';
import { Contract, RpcProvider, CallData, num } from 'starknet';

import type { DepositorInfo, LeaderboardEntry } from '@/store/game-store';

// =====================================================================
//  Config
// =====================================================================

const RPC_URL = 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/demo';

export const CONTRACT_ADDRESSES = {
  vault:    process.env.NEXT_PUBLIC_VAULT_CONTRACT    ?? '0x0',
  wbtc:     process.env.NEXT_PUBLIC_WBTC_CONTRACT     ?? '0x0',
  iyToken:  process.env.NEXT_PUBLIC_IY_TOKEN_CONTRACT ?? '0x0',
  treasury: process.env.NEXT_PUBLIC_TREASURY_ADDRESS  ?? '0x0',
};

export const CONTRACTS_DEPLOYED = CONTRACT_ADDRESSES.vault !== '0x0';

// =====================================================================
//  Cartridge Controller (singleton)
// =====================================================================

let _controller: ControllerProvider | null = null;

function getController(): ControllerProvider {
  if (!_controller) {
    _controller = new ControllerProvider({
      rpcUrl: RPC_URL,
      chains: [{ rpcUrl: RPC_URL }],
    });
  }
  return _controller;
}

// =====================================================================
//  RPC Provider (read-only)
// =====================================================================

let _provider: RpcProvider | null = null;

export function getProvider(): RpcProvider {
  if (!_provider) _provider = new RpcProvider({ nodeUrl: RPC_URL });
  return _provider;
}

// =====================================================================
//  ABIs (minimal)
// =====================================================================

const VAULT_ABI = [
  { type: 'function', name: 'get_score',              inputs: [{ name: 'addr', type: 'core::starknet::contract_address::ContractAddress' }], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
  { type: 'function', name: 'get_leaderboard',        inputs: [], outputs: [{ type: 'core::array::Array::<infiniyield::interfaces::i_vault::LeaderboardEntry>' }], state_mutability: 'view' },
  { type: 'function', name: 'get_depositor_info',     inputs: [{ name: 'addr', type: 'core::starknet::contract_address::ContractAddress' }], outputs: [{ type: 'infiniyield::interfaces::i_vault::DepositorInfo' }], state_mutability: 'view' },
  { type: 'function', name: 'get_season_number',      inputs: [], outputs: [{ type: 'core::integer::u64' }], state_mutability: 'view' },
  { type: 'function', name: 'get_season_start_block', inputs: [], outputs: [{ type: 'core::integer::u64' }], state_mutability: 'view' },
  { type: 'function', name: 'get_season_yield_pool',  inputs: [], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
  { type: 'function', name: 'get_total_deposited',    inputs: [], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
  { type: 'function', name: 'get_current_block',      inputs: [], outputs: [{ type: 'core::integer::u64' }], state_mutability: 'view' },
] as const;

const ERC20_ABI = [
  { type: 'function', name: 'balance_of', inputs: [{ name: 'account', type: 'core::starknet::contract_address::ContractAddress' }], outputs: [{ type: 'core::integer::u256' }], state_mutability: 'view' },
] as const;

// =====================================================================
//  Read helpers
// =====================================================================

function toBigInt(val: unknown): bigint {
  if (typeof val === 'bigint') return val;
  if (typeof val === 'number') return BigInt(val);
  if (typeof val === 'string') return BigInt(val);
  return 0n;
}

function vaultContract(): Contract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Contract({ abi: VAULT_ABI as any, address: CONTRACT_ADDRESSES.vault, providerOrAccount: getProvider() });
}

function erc20Contract(address: string): Contract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Contract({ abi: ERC20_ABI as any, address, providerOrAccount: getProvider() });
}

// =====================================================================
//  Read Functions
// =====================================================================

export async function fetchSeasonData() {
  if (!CONTRACTS_DEPLOYED) return null;
  const vault = vaultContract();
  const [seasonNumber, seasonStartBlock, yieldPool, totalDeposited, currentBlock] =
    await Promise.all([
      vault.get_season_number(),
      vault.get_season_start_block(),
      vault.get_season_yield_pool(),
      vault.get_total_deposited(),
      vault.get_current_block(),
    ]);

  return {
    seasonNumber:     toBigInt(seasonNumber),
    seasonStartBlock: toBigInt(seasonStartBlock),
    currentBlock:     toBigInt(currentBlock),
    yieldPool:        toBigInt(yieldPool),
    totalDeposited:   toBigInt(totalDeposited),
  };
}

export async function fetchDepositorInfo(address: string): Promise<DepositorInfo> {
  const vault = vaultContract();
  const info = await vault.get_depositor_info(address);
  return {
    principal:         toBigInt(info.principal),
    t_effective:       toBigInt(info.t_effective),
    score:             toBigInt(info.score),
    claimable_yield:   toBigInt(info.claimable_yield),
    last_update_block: toBigInt(info.last_update_block),
    last_claim_block:  toBigInt(info.last_claim_block),
  };
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const vault = vaultContract();
  const raw: Array<{ addr: string; score: bigint }> = await vault.get_leaderboard();
  return raw.map((entry, i) => ({
    rank:  i + 1,
    addr:  num.toHex(entry.addr),
    score: toBigInt(entry.score),
  }));
}

export async function fetchTokenBalance(tokenAddress: string, walletAddress: string): Promise<bigint> {
  const contract = erc20Contract(tokenAddress);
  return toBigInt(await contract.balance_of(walletAddress));
}

// =====================================================================
//  Wallet — Cartridge Controller
// =====================================================================

export interface ConnectedWallet {
  address: string;
  controller: ControllerProvider;
}

/**
 * Connect via Cartridge Controller.
 * Opens the Cartridge popup — user signs in with their controller username.
 */
export async function connectCartridge(): Promise<ConnectedWallet> {
  const controller = getController();
  const account = await controller.connect();
  if (!account) throw new Error('Connection rejected');
  const address = account.address;
  return { address, controller };
}

export async function disconnectCartridge(): Promise<void> {
  const controller = getController();
  await controller.disconnect();
  _controller = null;
}

// =====================================================================
//  Write Functions (via ControllerProvider.openExecute)
// =====================================================================

/** u256 as two felts [low, high] */
function u256Calldata(val: bigint): string[] {
  return [
    (val & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn).toString(),
    (val >> 128n).toString(),
  ];
}

/**
 * Approve + Deposit in one multicall via Cartridge's openExecute.
 * Returns transaction hash.
 */
export async function depositWBTC(
  controller: ControllerProvider,
  amountSats: bigint,
): Promise<string> {
  const result = await controller.openExecute([
    {
      contractAddress: CONTRACT_ADDRESSES.wbtc,
      entrypoint: 'approve',
      calldata: CallData.compile({
        spender: CONTRACT_ADDRESSES.vault,
        amount: {
          low:  (amountSats & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn).toString(),
          high: (amountSats >> 128n).toString(),
        },
      }),
    },
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'deposit',
      calldata: u256Calldata(amountSats),
    },
  ]);

  if (!result?.transactionHash) throw new Error('Transaction failed or rejected');
  return result.transactionHash;
}

export async function claimYield(controller: ControllerProvider): Promise<string> {
  const result = await controller.openExecute([
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'claim_yield',
      calldata: [],
    },
  ]);
  if (!result?.transactionHash) throw new Error('Transaction failed or rejected');
  return result.transactionHash;
}

export async function harvestYield(controller: ControllerProvider): Promise<string> {
  const result = await controller.openExecute([
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'harvest_and_distribute',
      calldata: [],
    },
  ]);
  if (!result?.transactionHash) throw new Error('Transaction failed or rejected');
  return result.transactionHash;
}

export async function endSeason(controller: ControllerProvider): Promise<string> {
  const result = await controller.openExecute([
    {
      contractAddress: CONTRACT_ADDRESSES.vault,
      entrypoint: 'end_season',
      calldata: [],
    },
  ]);
  if (!result?.transactionHash) throw new Error('Transaction failed or rejected');
  return result.transactionHash;
}

/** Testnet only — free mint of mock wBTC */
export async function mintMockWBTC(
  controller: ControllerProvider,
  toAddress: string,
  amountSats: bigint,
): Promise<string> {
  const result = await controller.openExecute([
    {
      contractAddress: CONTRACT_ADDRESSES.wbtc,
      entrypoint: 'mint',
      calldata: CallData.compile({
        to: toAddress,
        amount: {
          low:  (amountSats & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn).toString(),
          high: (amountSats >> 128n).toString(),
        },
      }),
    },
  ]);
  if (!result?.transactionHash) throw new Error('Transaction failed or rejected');
  return result.transactionHash;
}
