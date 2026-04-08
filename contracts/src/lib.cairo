// INFINIYIELD - "Trap the Whale"
// "winning is easy, put more money than the rest...
//  if there is no one with more money than you."

pub mod tokens {
    pub mod mock_wbtc;
    pub mod iy_token;
}

pub mod mocks {
    pub mod mock_yield_source;
}

pub mod vault {
    pub mod leaderboard;
    pub mod vault_core;
}

pub mod interfaces {
    pub mod i_vault;
    pub mod i_yield_source;
}
