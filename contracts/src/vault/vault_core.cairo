// ============================================================
// INFINIYIELD VaultCore — "Trap the Whale"
// ============================================================
//
// Tagline: "winning is easy, put more money than the rest...
//           if there is no one with more money than you."
//
// === CORE INVARIANTS (NEVER VIOLATE) ===
//   1. NO WITHDRAW FUNCTION — deposits are permanent. This IS the game.
//   2. principals[addr] only increases, never decreases
//   3. t_effective resets on season end, principal NEVER resets
//   4. Linear scoring prevents sybil: score = principal_sats × t_eff / 100
//
// === SCORING (LINEAR) ===
//   t_effective_scaled accumulates per block:
//     blocks in days  1-45:  += 100 per BLOCKS_PER_DAY
//     blocks in days 46-90:  += 70  per BLOCKS_PER_DAY
//     blocks 91+:            += 40  per BLOCKS_PER_DAY
//   score = principal_sats × t_effective_scaled / 100
//
//   SYBIL PROOF: 0.5 BTC × t + 0.5 BTC × t = 1 BTC × t
//   Splitting wallets provides ZERO advantage. Period.
//
// === SEASON ===
//   SEASON_BLOCKS = 100 (testing); real = 2,592,000 (~60 days)
//   Season end: t_effective resets to 0, principal stays forever
//
// === YIELD SPLIT ===
//   70% → top 10 (quadratic: (11-rank)² / 385)
//   20% → all depositors pro-rata by principal
//   10% → treasury
//   Claim: 1% fee, 24h cooldown (43200 blocks), min 1000 sats

#[starknet::contract]
pub mod VaultCore {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_number;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,
        Map, StorageMapReadAccess, StorageMapWriteAccess
    };
    use openzeppelin_interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use infiniyield::interfaces::i_vault::{
        IVault, DepositorInfo, LeaderboardEntry,
        IIYTokenDispatcher, IIYTokenDispatcherTrait
    };
    use infiniyield::interfaces::i_yield_source::{
        IYieldSourceDispatcher, IYieldSourceDispatcherTrait
    };
    use infiniyield::vault::leaderboard;

    // =========================================================
    //  CONSTANTS
    // =========================================================

    /// Season duration: 100 blocks for testing
    /// Production: 2_592_000 blocks ≈ 60 days at ~2s/block
    const SEASON_BLOCKS: u64 = 100;

    /// Sepolia: ~2s/block → 1 day ≈ 43200 blocks
    const BLOCKS_PER_DAY: u64 = 43200;

    /// Scoring tier boundaries (in days)
    const DAY_45: u64 = 45;
    const DAY_90: u64 = 90;

    /// t_effective rate multipliers per day (×100 for precision)
    const RATE_TIER1: u64 = 100; // days 1-45
    const RATE_TIER2: u64 = 70;  // days 46-90
    const RATE_TIER3: u64 = 40;  // days 91+

    /// 24h cooldown for claiming yield
    const CLAIM_COOLDOWN_BLOCKS: u64 = 43200;

    /// Minimum claim: 1000 sats (satoshis)
    const MIN_CLAIM_SATS: u256 = 1000;

    /// Claim fee: 1% (100 basis points)
    const CLAIM_FEE_BPS: u256 = 100;
    const BPS_DENOM: u256 = 10000;

    /// IY mint: 1 IY (1e18) per 1000 sats deposited
    const IY_PER_1000_SATS: u256 = 1_000_000_000_000_000_000; // 1e18

    /// Yield split percentages
    const YIELD_TOP10_PCT: u256 = 70;
    const YIELD_DEPOSITORS_PCT: u256 = 20;
    const PCT_DENOM: u256 = 100;

    // =========================================================
    //  STORAGE
    // =========================================================

    #[storage]
    struct Storage {
        // --- Config ---
        owner: ContractAddress,
        wbtc: ContractAddress,
        iy_token: ContractAddress,
        yield_source: ContractAddress,
        treasury: ContractAddress,

        // --- Global Season State ---
        total_deposited: u256,
        season_number: u64,
        season_start_block: u64,
        season_yield_pool: u256,

        // --- Depositor Registry ---
        depositor_count: u64,
        depositors: Map<u64, ContractAddress>,
        is_depositor: Map<ContractAddress, bool>,

        // --- Per-Depositor State ---
        /// Principal (wBTC sats) — ONLY increases, NEVER resets
        principals: Map<ContractAddress, u256>,
        /// Time score scaled ×100 — resets each season
        t_effective: Map<ContractAddress, u128>,
        /// Block of last t_effective update
        last_update_block: Map<ContractAddress, u64>,
        /// Block of last yield claim
        last_claim_block: Map<ContractAddress, u64>,
        /// Accumulated claimable yield (in wBTC sats)
        claimable_yield: Map<ContractAddress, u256>,

        // --- Leaderboard (rank 1-10, rank 1 = highest score) ---
        lb_addresses: Map<u8, ContractAddress>,
        lb_scores: Map<ContractAddress, u256>,
        lb_size: u8,
    }

    // =========================================================
    //  EVENTS
    // =========================================================

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Deposited: Deposited,
        RankOvertake: RankOvertake,
        YieldClaimed: YieldClaimed,
        SeasonEnded: SeasonEnded,
        ScoreUpdated: ScoreUpdated,
        YieldHarvested: YieldHarvested,
    }

    /// Emitted when wBTC is deposited (permanently locked)
    #[derive(Drop, starknet::Event)]
    struct Deposited {
        #[key]
        depositor: ContractAddress,
        amount: u256,
        new_total: u256,
    }

    /// Emitted when a depositor enters the top-10 by displacing someone
    #[derive(Drop, starknet::Event)]
    struct RankOvertake {
        #[key]
        overtaker: ContractAddress,
        overtaken: ContractAddress,
        rank: u8,
    }

    /// Emitted when yield is claimed (net amount after 1% fee)
    #[derive(Drop, starknet::Event)]
    struct YieldClaimed {
        #[key]
        depositor: ContractAddress,
        amount: u256,
        fee: u256,
    }

    /// Emitted when a season ends (t_effective resets, principal stays)
    #[derive(Drop, starknet::Event)]
    struct SeasonEnded {
        season: u64,
        total_yield: u256,
    }

    /// Emitted when a depositor's score changes
    #[derive(Drop, starknet::Event)]
    struct ScoreUpdated {
        #[key]
        depositor: ContractAddress,
        score: u256,
    }

    /// Emitted when yield is harvested from the yield source
    #[derive(Drop, starknet::Event)]
    struct YieldHarvested {
        amount: u256,
        pool_total: u256,
    }

    // =========================================================
    //  CONSTRUCTOR
    // =========================================================

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        wbtc: ContractAddress,
        iy_token: ContractAddress,
        yield_source: ContractAddress,
        treasury: ContractAddress,
    ) {
        self.owner.write(owner);
        self.wbtc.write(wbtc);
        self.iy_token.write(iy_token);
        self.yield_source.write(yield_source);
        self.treasury.write(treasury);
        self.total_deposited.write(0_u256);
        self.season_number.write(1_u64);
        self.season_start_block.write(get_block_number());
        self.season_yield_pool.write(0_u256);
        self.lb_size.write(0_u8);
        self.depositor_count.write(0_u64);
    }

    // =========================================================
    //  INTERNAL HELPERS
    // =========================================================

    #[generate_trait]
    impl InternalImpl of InternalTrait {

        /// Update t_effective for an address based on blocks elapsed since last update.
        /// Called BEFORE modifying principal on deposit.
        ///
        /// t_effective_scaled accumulates:
        ///   days 1-45:  +100 per BLOCKS_PER_DAY
        ///   days 46-90: +70  per BLOCKS_PER_DAY
        ///   days 91+:   +40  per BLOCKS_PER_DAY
        fn update_t_effective_internal(ref self: ContractState, addr: ContractAddress) {
            let current_block = get_block_number();
            let last_block = self.last_update_block.read(addr);

            if last_block == 0 || current_block <= last_block {
                self.last_update_block.write(addr, current_block);
                return;
            }

            let elapsed_blocks: u64 = current_block - last_block;
            let season_start = self.season_start_block.read();

            // Offset: how many blocks into current tier schedule this address is
            let offset: u64 = if last_block >= season_start {
                last_block - season_start
            } else {
                0_u64
            };

            let delta = self.compute_t_delta(offset, elapsed_blocks);
            let current_t = self.t_effective.read(addr);
            self.t_effective.write(addr, current_t + delta);
            self.last_update_block.write(addr, current_block);

            // Emit score update
            let score = self.compute_score_for(addr);
            self.emit(ScoreUpdated { depositor: addr, score });
        }

        /// Compute t_effective delta for given start offset and elapsed blocks.
        /// Uses tiered rates based on blocks from season start.
        fn compute_t_delta(
            self: @ContractState,
            start_offset: u64,
            elapsed_blocks: u64
        ) -> u128 {
            let day45_block: u64 = DAY_45 * BLOCKS_PER_DAY;
            let day90_block: u64 = DAY_90 * BLOCKS_PER_DAY;

            let mut remaining = elapsed_blocks;
            let mut offset = start_offset;
            let mut delta: u128 = 0;

            // Tier 1: blocks 0 to day45_block (days 1-45, rate = 100/day)
            if offset < day45_block && remaining > 0 {
                let available: u64 = day45_block - offset;
                let used: u64 = if remaining < available { remaining } else { available };
                // delta += used * RATE_TIER1 / BLOCKS_PER_DAY
                delta += (used.into() * RATE_TIER1.into()) / BLOCKS_PER_DAY.into();
                remaining -= used;
                offset += used;
            }

            // Tier 2: blocks day45_block to day90_block (days 46-90, rate = 70/day)
            if offset < day90_block && remaining > 0 {
                let available: u64 = day90_block - offset;
                let used: u64 = if remaining < available { remaining } else { available };
                delta += (used.into() * RATE_TIER2.into()) / BLOCKS_PER_DAY.into();
                remaining -= used;
                offset += used;
            }

            // Tier 3: blocks day90_block+ (days 91+, rate = 40/day)
            if remaining > 0 {
                delta += (remaining.into() * RATE_TIER3.into()) / BLOCKS_PER_DAY.into();
            }

            delta
        }

        /// score = principal_sats × t_effective_scaled / 100
        /// LINEAR: score(A+B) = score(A) + score(B). No sybil advantage.
        fn compute_score_for(self: @ContractState, addr: ContractAddress) -> u256 {
            let principal = self.principals.read(addr);
            let t_eff: u128 = self.t_effective.read(addr);
            if t_eff == 0 || principal == 0 {
                return 0_u256;
            }
            principal * t_eff.into() / 100_u256
        }

        /// Update leaderboard for addr with their current score.
        /// Returns (overtaken_addr, rank) if someone was displaced (for event emit).
        fn update_leaderboard_for(
            ref self: ContractState,
            addr: ContractAddress,
            score: u256
        ) -> (ContractAddress, u8) {
            // Store the new score
            self.lb_scores.write(addr, score);

            let mut lb_size = self.lb_size.read();
            let zero: ContractAddress = core::num::traits::Zero::zero();

            // Find if addr already on leaderboard
            let mut existing_rank: u8 = 0;
            let mut i: u8 = 1;
            loop {
                if i > lb_size {
                    break;
                }
                if self.lb_addresses.read(i) == addr {
                    existing_rank = i;
                    break;
                }
                i += 1;
            };

            if existing_rank > 0 {
                // Already ranked — re-sort
                self.sort_leaderboard(lb_size);
                return (zero, 0_u8);
            }

            // Not ranked yet
            if lb_size < leaderboard::MAX_RANK {
                // Space available
                lb_size += 1;
                self.lb_addresses.write(lb_size, addr);
                self.lb_size.write(lb_size);
                self.sort_leaderboard(lb_size);
                return (zero, 0_u8);
            }

            // Board full — check if score beats the lowest-ranked entry
            let mut lowest_score: u256 = score;
            let mut lowest_rank: u8 = 0;
            let mut j: u8 = 1;
            loop {
                if j > leaderboard::MAX_RANK {
                    break;
                }
                let entry_addr = self.lb_addresses.read(j);
                let entry_score = self.lb_scores.read(entry_addr);
                if entry_score < lowest_score {
                    lowest_score = entry_score;
                    lowest_rank = j;
                }
                j += 1;
            };

            if lowest_rank > 0 {
                let overtaken = self.lb_addresses.read(lowest_rank);
                // Clear overtaken address score
                self.lb_scores.write(overtaken, 0_u256);
                // Place addr in that slot
                self.lb_addresses.write(lowest_rank, addr);
                self.sort_leaderboard(lb_size);
                return (overtaken, lowest_rank);
            }

            (zero, 0_u8)
        }

        /// Insertion sort leaderboard descending by score (rank 1 = highest)
        fn sort_leaderboard(ref self: ContractState, size: u8) {
            if size <= 1 {
                return;
            }
            let mut i: u8 = 2;
            loop {
                if i > size {
                    break;
                }
                let key_addr = self.lb_addresses.read(i);
                let key_score = self.lb_scores.read(key_addr);
                let mut j: u8 = i;
                loop {
                    if j <= 1 {
                        break;
                    }
                    let prev_addr = self.lb_addresses.read(j - 1);
                    let prev_score = self.lb_scores.read(prev_addr);
                    if prev_score >= key_score {
                        break;
                    }
                    // Swap positions
                    self.lb_addresses.write(j, prev_addr);
                    self.lb_addresses.write(j - 1, key_addr);
                    j -= 1;
                };
                i += 1;
            };
        }

        /// Distribute season_yield_pool to top-10 and all depositors.
        /// Called by end_season() BEFORE resetting t_effective.
        fn distribute_yield_pool(ref self: ContractState) {
            let pool = self.season_yield_pool.read();
            if pool == 0 {
                return;
            }

            // Split the pool
            let top10_share: u256 = pool * YIELD_TOP10_PCT / PCT_DENOM;
            let depositors_share: u256 = pool * YIELD_DEPOSITORS_PCT / PCT_DENOM;
            let treasury_share: u256 = pool - top10_share - depositors_share;

            // --- Top-10: quadratic rank shares ---
            let lb_size = self.lb_size.read();
            if lb_size > 0 {
                let mut rank: u8 = 1;
                loop {
                    if rank > lb_size {
                        break;
                    }
                    let entry_addr = self.lb_addresses.read(rank);
                    let share_num = leaderboard::rank_share_numerator(rank);
                    // Share = top10_share × (11-rank)² / 385
                    let share: u256 = top10_share * share_num / leaderboard::RANK_SUM;
                    let current = self.claimable_yield.read(entry_addr);
                    self.claimable_yield.write(entry_addr, current + share);
                    rank += 1;
                };
            }

            // --- All depositors: pro-rata by principal ---
            let total_dep = self.total_deposited.read();
            if total_dep > 0 && depositors_share > 0 {
                let count = self.depositor_count.read();
                let mut idx: u64 = 0;
                loop {
                    if idx >= count {
                        break;
                    }
                    let dep_addr = self.depositors.read(idx);
                    let principal = self.principals.read(dep_addr);
                    if principal > 0 {
                        let share: u256 = depositors_share * principal / total_dep;
                        let current = self.claimable_yield.read(dep_addr);
                        self.claimable_yield.write(dep_addr, current + share);
                    }
                    idx += 1;
                };
            }

            // --- Treasury (10%) ---
            if treasury_share > 0 {
                let wbtc = IERC20Dispatcher { contract_address: self.wbtc.read() };
                wbtc.transfer(self.treasury.read(), treasury_share);
            }

            // Reset pool
            self.season_yield_pool.write(0_u256);
        }

        /// Reset t_effective for all depositors at season end.
        /// Principal is NOT touched — it stays forever.
        fn reset_all_t_effective(ref self: ContractState) {
            let count = self.depositor_count.read();
            let current_block = get_block_number();
            let mut idx: u64 = 0;
            loop {
                if idx >= count {
                    break;
                }
                let dep_addr = self.depositors.read(idx);
                // Reset time score to 0 — fresh start for new season
                self.t_effective.write(dep_addr, 0_u128);
                self.last_update_block.write(dep_addr, current_block);
                // Reset leaderboard score too
                self.lb_scores.write(dep_addr, 0_u256);
                idx += 1;
            };
        }
    }

    // =========================================================
    //  PUBLIC INTERFACE
    // =========================================================

    #[abi(embed_v0)]
    impl VaultImpl of IVault<ContractState> {

        /// === DEPOSIT ===
        /// Lock wBTC forever. There is NO withdraw function.
        /// Mints IY tokens (1 IY per 1000 sats).
        /// Updates t_effective and leaderboard.
        ///
        /// CRITICAL: This function intentionally has no counterpart.
        /// Deposits are permanent. The game is about commitment.
        fn deposit(ref self: ContractState, amount: u256) {
            assert(amount > 0, 'Vault: amount must be > 0');

            let caller = get_caller_address();
            let current_block = get_block_number();
            let contract_addr = starknet::get_contract_address();

            // Transfer wBTC from caller (caller must approve first)
            let wbtc = IERC20Dispatcher { contract_address: self.wbtc.read() };
            wbtc.transfer_from(caller, contract_addr, amount);

            // Forward to yield source for yield generation
            let yield_src = IYieldSourceDispatcher {
                contract_address: self.yield_source.read()
            };
            yield_src.deposit(amount);

            // Update t_effective BEFORE modifying principal
            // (time score is based on the balance you had, not the new balance)
            if self.principals.read(caller) > 0 {
                // Existing depositor — accumulate time score
                self.update_t_effective_internal(caller);
            } else {
                // First deposit — register in depositor list
                let count = self.depositor_count.read();
                self.depositors.write(count, caller);
                self.depositor_count.write(count + 1);
                self.is_depositor.write(caller, true);
                self.last_update_block.write(caller, current_block);
            }

            // Increase principal (INVARIANT: only increases)
            let new_principal = self.principals.read(caller) + amount;
            self.principals.write(caller, new_principal);

            // Update global total
            let new_total = self.total_deposited.read() + amount;
            self.total_deposited.write(new_total);

            // Mint IY tokens: 1 IY (1e18) per 1000 sats
            let iy_amount = (amount / 1000_u256) * IY_PER_1000_SATS;
            if iy_amount > 0 {
                let iy = IIYTokenDispatcher { contract_address: self.iy_token.read() };
                iy.vault_mint(caller, iy_amount);
            }

            // Recompute score and update leaderboard
            let score = self.compute_score_for(caller);
            let (overtaken, rank) = self.update_leaderboard_for(caller, score);

            let zero: ContractAddress = core::num::traits::Zero::zero();
            if overtaken != zero {
                self.emit(RankOvertake { overtaker: caller, overtaken, rank });
            }

            self.emit(Deposited { depositor: caller, amount, new_total });
        }

        /// === HARVEST ===
        /// Pull accumulated yield from the yield source into the season pool.
        /// Permissionless — anyone can call.
        fn harvest_and_distribute(ref self: ContractState) {
            let yield_src = IYieldSourceDispatcher {
                contract_address: self.yield_source.read()
            };
            let harvested = yield_src.harvest();

            if harvested > 0 {
                let new_pool = self.season_yield_pool.read() + harvested;
                self.season_yield_pool.write(new_pool);
                self.emit(YieldHarvested { amount: harvested, pool_total: new_pool });
            }
        }

        /// === CLAIM YIELD ===
        /// Claim accumulated yield from top-10 position and pro-rata share.
        /// Constraints:
        ///   - Must be a registered depositor
        ///   - 24h cooldown (43200 blocks)
        ///   - Minimum 1000 sats
        ///   - 1% fee goes to treasury
        fn claim_yield(ref self: ContractState) {
            let caller = get_caller_address();
            assert(self.is_depositor.read(caller), 'Vault: not a depositor');

            let current_block = get_block_number();
            let last_claim = self.last_claim_block.read(caller);

            // Enforce 24h cooldown
            if last_claim > 0 {
                assert(
                    current_block >= last_claim + CLAIM_COOLDOWN_BLOCKS,
                    'Vault: claim cooldown active'
                );
            }

            let claimable = self.claimable_yield.read(caller);
            assert(claimable >= MIN_CLAIM_SATS, 'Vault: below min claim (1000)');

            // Calculate 1% fee
            let fee: u256 = claimable * CLAIM_FEE_BPS / BPS_DENOM;
            let net: u256 = claimable - fee;

            // Reset claimable before transfer (re-entrancy safety)
            self.claimable_yield.write(caller, 0_u256);
            self.last_claim_block.write(caller, current_block);

            // Transfer net amount to caller
            let wbtc = IERC20Dispatcher { contract_address: self.wbtc.read() };
            wbtc.transfer(caller, net);

            // Transfer fee to treasury
            if fee > 0 {
                wbtc.transfer(self.treasury.read(), fee);
            }

            self.emit(YieldClaimed { depositor: caller, amount: net, fee });
        }

        /// === END SEASON ===
        /// Anyone can call after SEASON_BLOCKS have elapsed.
        /// Distributes yield pool to top-10 and all depositors.
        /// RESETS t_effective to 0. Principal STAYS FOREVER.
        fn end_season(ref self: ContractState) {
            let current_block = get_block_number();
            let season_start = self.season_start_block.read();
            assert(
                current_block >= season_start + SEASON_BLOCKS,
                'Vault: season not over yet'
            );

            let season = self.season_number.read();
            let total_yield = self.season_yield_pool.read();

            // 1. Distribute yield BEFORE resetting (order matters!)
            self.distribute_yield_pool();

            // 2. Reset t_effective for ALL depositors — principal is untouched
            self.reset_all_t_effective();

            // 3. Advance to next season
            self.season_number.write(season + 1);
            self.season_start_block.write(current_block);

            // Note: lb_addresses stays — same people can re-earn rank in new season
            // Their scores are reset to 0 by reset_all_t_effective()

            self.emit(SeasonEnded { season, total_yield });
        }

        // =========================================================
        //  VIEW FUNCTIONS
        // =========================================================

        /// Current score for an address: principal × t_effective / 100
        fn get_score(self: @ContractState, addr: ContractAddress) -> u256 {
            self.compute_score_for(addr)
        }

        /// Get top-10 leaderboard entries sorted by score (rank 1 = highest)
        fn get_leaderboard(self: @ContractState) -> Array<LeaderboardEntry> {
            let lb_size = self.lb_size.read();
            let mut result: Array<LeaderboardEntry> = ArrayTrait::new();
            let mut i: u8 = 1;
            loop {
                if i > lb_size {
                    break;
                }
                let addr = self.lb_addresses.read(i);
                let score = self.lb_scores.read(addr);
                result.append(LeaderboardEntry { addr, score });
                i += 1;
            };
            result
        }

        /// Full depositor state snapshot
        fn get_depositor_info(self: @ContractState, addr: ContractAddress) -> DepositorInfo {
            DepositorInfo {
                principal: self.principals.read(addr),
                t_effective: self.t_effective.read(addr),
                score: self.compute_score_for(addr),
                claimable_yield: self.claimable_yield.read(addr),
                last_update_block: self.last_update_block.read(addr),
                last_claim_block: self.last_claim_block.read(addr),
            }
        }

        fn get_season_number(self: @ContractState) -> u64 {
            self.season_number.read()
        }

        fn get_season_start_block(self: @ContractState) -> u64 {
            self.season_start_block.read()
        }

        fn get_season_yield_pool(self: @ContractState) -> u256 {
            self.season_yield_pool.read()
        }

        fn get_total_deposited(self: @ContractState) -> u256 {
            self.total_deposited.read()
        }

        fn get_current_block(self: @ContractState) -> u64 {
            get_block_number()
        }
    }
}
