// Mock wBTC — ERC20 with 8 decimals (like real BTC), free mint for testnet
// Anyone can call mint(). Used for testing deposits into the vault.
// Name: "Mock wBTC", Symbol: "mWBTC"

#[starknet::contract]
pub mod MockWBTC {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::ContractAddress;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    // Use ERC20MixinImpl but override decimals separately below
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    // Custom decimals config: 8 (satoshis, like real BTC)
    impl ERC20ImmutableConfig of ERC20Component::ImmutableConfig {
        const DECIMALS: u8 = 8;
    }

    // Embed standard ERC20 ABI (name, symbol, decimals, transfer, approve, etc.)
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        Minted: Minted,
    }

    #[derive(Drop, starknet::Event)]
    struct Minted {
        #[key]
        to: ContractAddress,
        amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.erc20.initializer("Mock wBTC", "mWBTC");
    }

    /// External mint — anyone can call on testnet (no access control)
    #[abi(embed_v0)]
    impl MockWBTCImpl of infiniyield::interfaces::i_vault::IMockToken<ContractState> {
        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            self.erc20.mint(to, amount);
            self.emit(Minted { to, amount });
        }
    }
}
