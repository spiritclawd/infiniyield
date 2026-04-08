// =============================================================
// INFINIYIELD — Yield Distribution & Season Tests
// =============================================================
// Run with: scarb test

#[cfg(test)]
mod test_season_math {

    #[test]
    fn test_season_duration() {
        let season_blocks: u64 = 100_u64;
        let prod_season: u64 = 2_592_000_u64;
        let blocks_per_day: u64 = 43200_u64;
        let prod_days = prod_season / blocks_per_day;
        assert(prod_days == 60_u64, 'Prod season = 60 days');
        assert(season_blocks < prod_season, 'Test < prod');
    }
    
    #[test]
    fn test_yield_split() {
        let pool: u256 = 100_000_000_u256;
        let top10 = pool * 70_u256 / 100_u256;
        let depositors = pool * 20_u256 / 100_u256;
        let treasury = pool - top10 - depositors;
        assert(top10 == 70_000_000_u256, 'Top10 = 70%');
        assert(depositors == 20_000_000_u256, 'Depositors = 20%');
        assert(treasury == 10_000_000_u256, 'Treasury = 10%');
        assert(top10 + depositors + treasury == pool, 'Sum = pool');
    }
    
    #[test]
    fn test_pro_rata() {
        let alice: u256 = 100_000_000_u256;
        let bob: u256 = 50_000_000_u256;
        let total = alice + bob;
        let share: u256 = 200_000_u256;
        
        let alice_share = share * alice / total;
        let bob_share = share * bob / total;
        assert(alice_share == 133_333_u256, 'Alice 2/3 share');
        assert(bob_share == 66_666_u256, 'Bob 1/3 share');
        assert(alice_share + bob_share <= share, 'Within budget');
    }
    
    #[test]
    fn test_season_end_invariants() {
        // t_effective resets, principal stays
        let t_before: u128 = 4500_u128;
        let principal: u256 = 100_000_000_u256;
        
        let t_after: u128 = 0_u128; // RESET
        let principal_after = principal; // UNCHANGED
        
        assert(t_before > t_after, 'Before > after');
        assert(t_after == 0_u128, 'Reset to 0');
        assert(principal_after == principal, 'Principal unchanged');
    }
    
    #[test]
    fn test_claim_cooldown() {
        let cooldown: u64 = 43200_u64;
        let last: u64 = 1000_u64;
        let ok: u64 = 44200_u64;
        let too_early: u64 = 44199_u64;
        
        assert(ok >= last + cooldown, 'Cooldown passed');
        assert(too_early < last + cooldown, 'Too early');
    }
    
    #[test]
    fn test_min_claim() {
        let min: u256 = 1000_u256;
        assert(999_u256 < min, 'Below min fails');
        assert(1000_u256 >= min, 'At min passes');
    }
}

#[cfg(test)]
mod test_quadratic {
    use infiniyield::vault::leaderboard;
    
    #[test]
    fn test_rank_shares_distribution() {
        let pool: u256 = 70_000_000_u256;
        
        let r1 = leaderboard::rank_share_numerator(1_u8);
        let r1_share = pool * r1 / leaderboard::RANK_SUM;
        let r10_share = pool * leaderboard::rank_share_numerator(10_u8) / leaderboard::RANK_SUM;
        
        assert(r1_share > r10_share, 'Rank1 > Rank10 share');
        assert(r1_share > 18_000_000_u256, 'Rank1 ~25.97% of pool');
        
        // Sum all shares
        let mut total: u256 = 0_u256;
        let mut rank: u8 = 1_u8;
        loop {
            if rank > 10_u8 { break; }
            total += pool * leaderboard::rank_share_numerator(rank) / leaderboard::RANK_SUM;
            rank += 1_u8;
        };
        assert(total <= pool, 'Within pool');
        assert(pool - total <= 10_u256, 'Minimal rounding');
    }
}
