/**
 * INFINIYIELD - Starkzap Client Integration
 *
 * This module provides the core integration with starkzap for:
 * - Wallet connection via Cartridge Controller
 * - BTC (wBTC) balance and transfers
 * - BTC staking via Endurance validator
 * - Fee routing to vault and platform treasury
 */

import { 
  StarkZap,
  StarkSigner,
  OnboardStrategy,
  Amount,
  fromAddress,
  type WalletInterface,
  type Token,
  type Address,
} from 'starkzap';
import { mainnetTokens, sepoliaTokens } from 'starkzap';

// Network configuration
export type Network = 'mainnet' | 'sepolia';

// Token addresses on Starknet (wBTC is the wrapped Bitcoin)
export const TOKENS = {
  mainnet: {
    BTC: mainnetTokens.WBTC, // wBTC wrapper (wrapped Bitcoin)
    ETH: mainnetTokens.ETH,
    USDC: mainnetTokens.USDC,
    STRK: mainnetTokens.STRK,
  },
  sepolia: {
    BTC: sepoliaTokens.WBTC, // wBTC on testnet
    ETH: sepoliaTokens.ETH,
    USDC: sepoliaTokens.USDC,
    STRK: sepoliaTokens.STRK,
  },
};

// Endurance validator address for BTC staking (placeholder - replace with actual validator address)
const getEnduranceValidator = (): Address => fromAddress('0x054f9adf425f006a2c332c0c3b0c7e2e4e9e2e8e7e6e5e4e3e2e1e0e9e8e7e6e');

/**
 * InfiniYieldSDK - Main class for platform integration
 * 
 * Usage:
 * ```typescript
 * const sdk = new InfiniYieldSDK('mainnet');
 * const wallet = await sdk.connectWallet();
 * const balance = await sdk.getBTCBalance();
 * ```
 */
export class InfiniYieldSDK {
  private starkzap: StarkZap;
  private network: Network;
  private wallet: WalletInterface | null = null;

  constructor(network: Network = 'mainnet') {
    this.network = network;
    this.starkzap = new StarkZap({ network });
  }

  /**
   * Connect wallet using Cartridge Controller
   * This provides seamless UX with session keys and gasless transactions
   */
  async connectWallet(): Promise<WalletInterface> {
    const result = await this.starkzap.onboard({
      strategy: OnboardStrategy.Cartridge,
      deploy: 'if_needed',
    });
    
    this.wallet = result.wallet;
    return this.wallet;
  }

  /**
   * Connect with private key (for testing/backend)
   */
  async connectWithPrivateKey(privateKey: string): Promise<WalletInterface> {
    const result = await this.starkzap.connectWallet({
      account: { signer: new StarkSigner(privateKey) },
    });
    
    await result.ensureReady({ deploy: 'if_needed' });
    this.wallet = result;
    return this.wallet;
  }

  /**
   * Get connected wallet address
   */
  getAddress(): Address {
    if (!this.wallet) throw new Error('Wallet not connected');
    return this.wallet.address;
  }

  /**
   * Get BTC (wBTC) balance for connected wallet
   */
  async getBTCBalance(): Promise<bigint> {
    if (!this.wallet) throw new Error('Wallet not connected');
    const token = TOKENS[this.network].BTC;
    const balance = await this.wallet.balanceOf(token);
    return balance.toBase();
  }

  /**
   * Get formatted BTC balance
   */
  async getBTCBalanceFormatted(): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    const token = TOKENS[this.network].BTC;
    const balance = await this.wallet.balanceOf(token);
    return balance.toFormatted();
  }

  /**
   * Stake BTC via Endurance validator
   * This is the core yield-generating mechanism
   * 
   * @param amountBTC - Amount in BTC (e.g., 0.001)
   * @returns Transaction hash
   */
  async stakeBTC(amountBTC: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const amount = Amount.parse(amountBTC, token);

    // Stake via Endurance validator (4-6% APY on BTC)
    const staking = await this.wallet.stakingInStaker(getEnduranceValidator(), token);
    const tx = await staking.stake(this.wallet, amount);

    await tx.wait();
    return tx.hash;
  }

  /**
   * Unstake BTC from Endurance
   */
  async unstakeBTC(amountBTC: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const amount = Amount.parse(amountBTC, token);

    const staking = await this.wallet.stakingInStaker(getEnduranceValidator(), token);
    
    // Initiate exit intent
    const exitTx = await staking.exitIntent(this.wallet, amount);
    await exitTx.wait();
    
    return exitTx.hash;
  }

  /**
   * Transfer BTC to a recipient
   * Used for entry fee payments to vault
   */
  async transferBTC(recipient: Address, amountBTC: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const amount = Amount.parse(amountBTC, token);

    const tx = await this.wallet.transfer(token, [
      { to: recipient, amount },
    ]);

    await tx.wait();
    return tx.hash;
  }

  /**
   * Pay entry fee with automatic split routing
   * 90% to vault, 10% to platform
   * 
   * This is the core money flow function that routes:
   * - Entry fee → 90% to Vault address (for staking/yield)
   * - Entry fee → 10% to Platform address (treasury)
   */
  async payEntryFee(
    vaultAddress: Address,
    platformAddress: Address,
    amountBTC: string,
  ): Promise<{ txHash: string; vaultAmount: string; platformAmount: string }> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const totalAmount = Amount.parse(amountBTC, token);
    
    // Calculate split: 90% vault, 10% platform
    const totalSatoshis = totalAmount.toBase();
    const vaultSatoshis = (totalSatoshis * 90n) / 100n;
    const platformSatoshis = (totalSatoshis * 10n) / 100n;
    
    const vaultAmount = Amount.fromRaw(vaultSatoshis, token);
    const platformAmount = Amount.fromRaw(platformSatoshis, token);

    // Build multi-transfer transaction (atomic split)
    const tx = await this.wallet.transfer(token, [
      { to: vaultAddress, amount: vaultAmount },
      { to: platformAddress, amount: platformAmount },
    ]);

    await tx.wait();
    
    return {
      txHash: tx.hash,
      vaultAmount: vaultAmount.toFormatted(),
      platformAmount: platformAmount.toFormatted(),
    };
  }

  /**
   * Get staking position info
   */
  async getStakingPosition(): Promise<{
    staked: bigint;
    rewards: bigint;
    apy: number;
  }> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const staking = await this.wallet.stakingInStaker(getEnduranceValidator(), token);
    const position = await staking.getPosition(this.wallet);
    
    return {
      staked: position?.staked.toBase() ?? 0n,
      rewards: position?.rewards.toBase() ?? 0n,
      apy: 0.05, // 5% APY (can be fetched from validator)
    };
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
      this.wallet = null;
    }
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.wallet !== null;
  }
}

// Singleton instance
let sdkInstance: InfiniYieldSDK | null = null;

export function getSDK(network: Network = 'mainnet'): InfiniYieldSDK {
  if (!sdkInstance) {
    sdkInstance = new InfiniYieldSDK(network);
  }
  return sdkInstance;
}

export default InfiniYieldSDK;
