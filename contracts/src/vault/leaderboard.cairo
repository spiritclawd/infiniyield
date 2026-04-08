// Leaderboard helpers for INFINIYIELD VaultCore
//
// The leaderboard itself is stored inside VaultCore storage.
// This module provides pure utility functions (constants, math).
//
// Top-10 scoring:
//   Rank shares are quadratic: rank_share = (11-rank)^2
//   Sum of all rank shares: 10^2 + 9^2 + ... + 1^2 = 385
//   Yield fraction for rank r = (11-r)^2 / 385

/// Maximum number of leaderboard entries
pub const MAX_RANK: u8 = 10;

/// Denominator for quadratic rank shares sum(1..10 of (11-r)^2)
/// = 100 + 81 + 64 + 49 + 36 + 25 + 16 + 9 + 4 + 1 = 385
pub const RANK_SUM: u256 = 385;

/// Returns (11 - rank)^2, the quadratic numerator for yield share.
/// rank is 1-indexed (1 = best rank, gets the most)
pub fn rank_share_numerator(rank: u8) -> u256 {
    assert(rank >= 1 && rank <= 10, 'LB: invalid rank 1-10');
    let r: u256 = (11_u8 - rank).into();
    r * r
}
