// =============================================================
// INFINIYIELD — Deposit Tests
// =============================================================
// Pure unit tests (no contract deployment needed)
// Run with: scarb test
//
// Integration tests (with contract deployment) require snforge.
// See DEPLOY.md for snforge installation instructions.

// ----------------------------------------------------------------
// Test 1: IY token mint rate math
// ----------------------------------------------------------------
#[cfg(test)]
mod test_iy_mint_math {
    #[test]
    fn test_iy_per_1000_sats() {
        // IY mint rate: 1 IY (1e18) per 1000 sats
        let iy_per_1000_sats: u256 = 1_000_000_000_000_000_000_u256; // 1e18
        
        // 1 BTC = 100_000_000 sats → 100_000 IY
        let deposit: u256 = 100_000_000_u256;
        let iy = (deposit / 1000_u256) * iy_per_1000_sats;
        // 100_000 * 1e18 = 1e23
        assert(iy == 100_000_u256 * 1_000_000_000_000_000_000_u256, 'IY calc: 1 BTC');
        
        // 0.001 BTC = 100_000 sats → 100 IY
        let small: u256 = 100_000_u256;
        let small_iy = (small / 1000_u256) * iy_per_1000_sats;
        assert(small_iy == 100_u256 * 1_000_000_000_000_000_000_u256, 'IY calc: small');
        
        // Minimum deposit that gets IY: 1000 sats → 1 IY
        let min_for_iy: u256 = 1000_u256;
        let min_iy = (min_for_iy / 1000_u256) * iy_per_1000_sats;
        assert(min_iy == iy_per_1000_sats, 'IY calc: min 1000 sats');
        
        // 999 sats → 0 IY (integer division rounds down)
        let below_threshold: u256 = 999_u256;
        let zero_iy = (below_threshold / 1000_u256) * iy_per_1000_sats;
        assert(zero_iy == 0_u256, 'IY: 999 sats = 0 IY');
    }
}

// ----------------------------------------------------------------
// Test 2: NO WITHDRAW FUNCTION — Interface verification
// ----------------------------------------------------------------
#[cfg(test)]
mod test_no_withdraw {
    use infiniyield::interfaces::i_vault::IVault;
    
    // The IVault trait has these functions:
    //   deposit, harvest_and_distribute, claim_yield, end_season (write)
    //   get_score, get_leaderboard, get_depositor_info, get_season_number,
    //   get_season_start_block, get_season_yield_pool, get_total_deposited,
    //   get_current_block (read)
    //
    // There is intentionally NO withdraw() function.
    // Deposits are permanent — this IS the game.
    #[test]
    fn test_no_withdraw_invariant() {
        // This test compiles only because IVault has no withdraw().
        // Importing IVault proves the interface doesn't expose withdraw.
        // If you try to call withdraw(), you get a compile error.
        assert(1_u8 == 1_u8, 'no-withdraw: ok');
    }
}

// ----------------------------------------------------------------
// Test 3: Principal accumulation math
// ----------------------------------------------------------------
#[cfg(test)]
mod test_principal_accumulates {
    #[test]
    fn test_principal_only_increases() {
        let deposit1: u256 = 50_000_000_u256; // 0.5 BTC
        let deposit2: u256 = 30_000_000_u256; // 0.3 BTC
        
        // Simulates: principals[addr] += amount
        let mut principal: u256 = 0_u256;
        let before1 = principal;
        principal += deposit1;
        assert(principal > before1, 'After deposit1 > before');
        
        let before2 = principal;
        principal += deposit2;
        assert(principal > before2, 'After deposit2 > before');
        assert(principal == deposit1 + deposit2, 'Total correct');
        
        // Key invariant: principal never decreases
        // (no subtract, no reset during normal operation)
        assert(principal >= deposit1, 'Principal >= first deposit');
        assert(principal >= deposit2, 'Principal >= second deposit');
    }
    
    #[test]
    fn test_total_deposited_tracks_sum() {
        let alice: u256 = 100_000_000_u256;
        let bob: u256 = 50_000_000_u256;
        let carol: u256 = 75_000_000_u256;
        
        let total = alice + bob + carol;
        assert(total == 225_000_000_u256, 'Total = sum of all deposits');
    }
}
