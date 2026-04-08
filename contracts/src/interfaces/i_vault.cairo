// INFINIYIELD Vault interfaces and shared types

use starknet::ContractAddress;

/// Depositor info struct returned by get_depositor_info
#[derive(Drop, Serde)]
pub struct DepositorInfo {
    pub principal: u256,
    pub t_effective: u128,
    pub score: u256,
    pub claimable_yield: u256,
    pub last_update_block: u64,
    pub last_claim_block: u64,
}

/// Leaderboard entry
#[derive(Drop, Serde, Copy)]
pub struct LeaderboardEntry {
    pub addr: ContractAddress,
    pub score: u256,
}

/// Main vault interface
#[starknet::interface]
pub trait IVault<TContractState> {
    // --- Core Actions ---

    /// Lock wBTC forever, mint IY tokens, update leaderboard
    /// INVARIANT: NO WITHDRAW — this is permanent
    fn deposit(ref self: TContractState, amount: u256);

    /// Harvest yield from source and add to season pool
    fn harvest_and_distribute(ref self: TContractState);

    /// Claim yield — 1% fee, 24h cooldown, min 1000 sats
    fn claim_yield(ref self: TContractState);

    /// End current season — resets t_effective, principal stays
    /// Anyone can call after SEASON_BLOCKS elapsed
    fn end_season(ref self: TContractState);

    // --- Views ---

    fn get_score(self: @TContractState, addr: ContractAddress) -> u256;
    fn get_leaderboard(self: @TContractState) -> Array<LeaderboardEntry>;
    fn get_depositor_info(self: @TContractState, addr: ContractAddress) -> DepositorInfo;
    fn get_season_number(self: @TContractState) -> u64;
    fn get_season_start_block(self: @TContractState) -> u64;
    fn get_season_yield_pool(self: @TContractState) -> u256;
    fn get_total_deposited(self: @TContractState) -> u256;
    fn get_current_block(self: @TContractState) -> u64;
}

/// Interface for mocking token mint (wBTC testnet)
#[starknet::interface]
pub trait IMockToken<TContractState> {
    fn mint(ref self: TContractState, to: ContractAddress, amount: u256);
}

/// Interface for IY token minting (vault-only)
#[starknet::interface]
pub trait IIYToken<TContractState> {
    fn vault_mint(ref self: TContractState, to: ContractAddress, amount: u256);
    fn get_vault(self: @TContractState) -> ContractAddress;
}

/// Decimals override interface
#[starknet::interface]
pub trait IDecimals<TContractState> {
    fn decimals(self: @TContractState) -> u8;
}
