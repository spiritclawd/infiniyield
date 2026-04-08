// =============================================================
// INFINIYIELD — Scoring & Sybil Resistance Tests
// =============================================================
// Run with: scarb test
//
// CRITICAL: Linear scoring means splitting wallets = ZERO advantage
// score = principal_sats x t_effective_scaled / 100

#[cfg(test)]
mod test_scoring_math {

    #[test]
    fn test_sybil_resistance_linear() {
        let one_btc: u256 = 100_000_000_u256;
        let half_btc: u256 = 50_000_000_u256;
        let t_eff: u256 = 1000_u256;
        
        let alice_score = one_btc * t_eff / 100_u256;
        let bob_score = half_btc * t_eff / 100_u256;
        let carol_score = half_btc * t_eff / 100_u256;
        
        // ANTI-SYBIL: alice == bob + carol
        assert(alice_score == bob_score + carol_score, 'Sybil: equal scores');
    }
    
    #[test]
    fn test_t_eff_one_day_tier1() {
        let blocks_per_day: u128 = 43200_u128;
        let rate_tier1: u128 = 100_u128;
        let elapsed: u128 = blocks_per_day;
        let delta = elapsed * rate_tier1 / blocks_per_day;
        assert(delta == 100_u128, 'Tier1 1 day = 100');
    }
    
    #[test]
    fn test_t_eff_one_day_tier2() {
        let blocks_per_day: u128 = 43200_u128;
        let rate_tier2: u128 = 70_u128;
        let elapsed: u128 = blocks_per_day;
        let delta = elapsed * rate_tier2 / blocks_per_day;
        assert(delta == 70_u128, 'Tier2 1 day = 70');
    }
    
    #[test]
    fn test_t_eff_one_day_tier3() {
        let blocks_per_day: u128 = 43200_u128;
        let rate_tier3: u128 = 40_u128;
        let elapsed: u128 = blocks_per_day;
        let delta = elapsed * rate_tier3 / blocks_per_day;
        assert(delta == 40_u128, 'Tier3 1 day = 40');
    }
    
    #[test]
    fn test_t_eff_45_days_tier1() {
        let blocks_per_day: u128 = 43200_u128;
        let rate_tier1: u128 = 100_u128;
        let days: u128 = 45_u128;
        let elapsed: u128 = days * blocks_per_day;
        let delta = elapsed * rate_tier1 / blocks_per_day;
        assert(delta == 4500_u128, '45 days tier1 = 4500');
    }
    
    #[test]
    fn test_score_linear_proportionality() {
        let one_btc: u256 = 100_000_000_u256;
        let two_btc: u256 = 200_000_000_u256;
        let t_eff: u256 = 500_u256;
        
        let score1 = one_btc * t_eff / 100_u256;
        let score2 = two_btc * t_eff / 100_u256;
        assert(score2 == score1 * 2_u256, 'Linear: 2 BTC = 2x score');
    }
    
    #[test]
    fn test_zero_t_eff_zero_score() {
        let principal: u256 = 100_000_000_u256;
        let t_eff: u256 = 0_u256;
        let score = principal * t_eff / 100_u256;
        assert(score == 0_u256, 'Zero t_eff = zero score');
    }
}

#[cfg(test)]
mod test_leaderboard_math {
    use infiniyield::vault::leaderboard;
    
    #[test]
    fn test_rank_shares_sum_to_385() {
        let mut sum: u256 = 0_u256;
        let mut rank: u8 = 1_u8;
        loop {
            if rank > 10_u8 {
                break;
            }
            sum += leaderboard::rank_share_numerator(rank);
            rank += 1_u8;
        };
        assert(sum == leaderboard::RANK_SUM, 'Sum = 385');
    }
    
    #[test]
    fn test_rank1_beats_rank10() {
        let r1 = leaderboard::rank_share_numerator(1_u8);
        let r10 = leaderboard::rank_share_numerator(10_u8);
        assert(r1 == 100_u256, 'Rank1 share = 100');
        assert(r10 == 1_u256, 'Rank10 share = 1');
        assert(r1 > r10, 'Rank1 > Rank10');
    }
    
    #[test]
    fn test_claim_fee_math() {
        let claimable: u256 = 1_000_000_u256;
        let fee_bps: u256 = 100_u256;
        let bps_denom: u256 = 10000_u256;
        
        let fee = claimable * fee_bps / bps_denom;
        let net = claimable - fee;
        
        assert(fee == 10_000_u256, 'Fee = 1%');
        assert(net == 990_000_u256, 'Net = 99%');
        assert(fee + net == claimable, 'Sum correct');
    }
}
