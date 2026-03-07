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
  OnboardStrategy, 
  StarkSigner, 
  Amount, 
  fromAddress,
  mainnetTokens,
  sepoliaTokens,
  type Wallet,
  type Token,
} from 'starkzap';

// Network configuration
export type Network = 'mainnet' | 'sepolia';

// Token addresses on Starknet
export const TOKENS = {
  mainnet: {
    BTC: mainnetTokens.BTC, // wBTC wrapper
    ETH: mainnetTokens.ETH,
    USDC: mainnetTokens.USDC,
    STRK: mainnetTokens.STRK,
  },
  sepolia: {
    BTC: sepoliaTokens.BTC,
    ETH: sepoliaTokens.ETH,
    USDC: sepoliaTokens.USDC,
    STRK: sepoliaTokens.STRK,
  },
};

// Endurance validator for BTC staking
const ENDURANCE_VALIDATOR = 'ENDURANCE';

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
  private wallet: Wallet | null = null;

  constructor(network: Network = 'mainnet') {
    this.network = network;
    this.starkzap = new StarkZap({ network });
  }

  /**
   * Connect wallet using Cartridge Controller
   * This provides seamless UX with session keys and gasless transactions
   */
  async connectWallet(): Promise<Wallet> {
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
  async connectWithPrivateKey(privateKey: string): Promise<Wallet> {
    const result = await this.starkzap.onboard({
      strategy: OnboardStrategy.Signer,
      account: { signer: new StarkSigner(privateKey) },
      deploy: 'if_needed',
    });
    
    this.wallet = result.wallet;
    return this.wallet;
  }

  /**
   * Get connected wallet address
   */
  getAddress(): string {
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
    return balance.toBigInt();
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
    const tx = await this.starkzap.stake(amount.toBigInt(), {
      validator: ENDURANCE_VALIDATOR,
    });

    return tx.transactionHash;
  }

  /**
   * Unstake BTC from Endurance
   */
  async unstakeBTC(amountBTC: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const amount = Amount.parse(amountBTC, token);

    const tx = await this.starkzap.unstake(amount.toBigInt(), {
      validator: ENDURANCE_VALIDATOR,
    });

    return tx.transactionHash;
  }

  /**
   * Transfer BTC to a recipient
   * Used for entry fee payments to vault
   */
  async transferBTC(recipient: string, amountBTC: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const amount = Amount.parse(amountBTC, token);

    const tx = await this.wallet.transfer(token, [
      { to: fromAddress(recipient), amount },
    ]);

    await tx.wait();
    return tx.transactionHash;
  }

  /**
   * Pay entry fee with automatic split routing
   * 90% to vault, 10% to platform
   */
  async payEntryFee(
    vaultAddress: string,
    platformAddress: string,
    amountBTC: string,
  ): Promise<{ txHash: string; vaultAmount: string; platformAmount: string }> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const token = TOKENS[this.network].BTC;
    const totalAmount = Amount.parse(amountBTC, token);
    
    // Calculate split: 90% vault, 10% platform
    const vaultAmount = totalAmount.toBigInt() * 90n / 100n;
    const platformAmount = totalAmount.toBigInt() * 10n / 100n;

    // Build multi-transfer transaction
    const tx = await this.wallet.transfer(token, [
      { to: fromAddress(vaultAddress), amount: Amount.fromBigInt(vaultAmount, token) },
      { to: fromAddress(platformAddress), amount: Amount.fromBigInt(platformAmount, token) },
    ]);

    await tx.wait();
    
    return {
      txHash: tx.transactionHash,
      vaultAmount: Amount.fromBigInt(vaultAmount, token).toFormatted(),
      platformAmount: Amount.fromBigInt(platformAmount, token).toFormatted(),
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
    // In production, query from Endurance staking contract
    // For now, return mock data
    return {
      staked: 0n,
      rewards: 0n,
      apy: 0.05, // 5% APY
    };
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.wallet = null;
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
