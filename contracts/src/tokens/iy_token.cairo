// IY Token — InfiniYield reward/governance token
// ERC20, 18 decimals (default)
// Only the vault address (set at construction) can call vault_mint()
// Mint rate: 1 IY (1e18) per 1000 sats deposited into the vault
// Name: "InfiniYield", Symbol: "IY"

#[starknet::contract]
pub mod IYToken {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl, DefaultConfig};
    use starknet::ContractAddress;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    // Standard 18-decimal ERC20 mixin
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        /// Only this address can call vault_mint()
        vault: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        IYMinted: IYMinted,
    }

    #[derive(Drop, starknet::Event)]
    struct IYMinted {
        #[key]
        to: ContractAddress,
        amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, vault: ContractAddress) {
        self.erc20.initializer("InfiniYield", "IY");
        self.vault.write(vault);
    }

    /// vault_mint — only callable by the vault
    #[abi(embed_v0)]
    impl IYTokenImpl of infiniyield::interfaces::i_vault::IIYToken<ContractState> {
        fn vault_mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            let caller = starknet::get_caller_address();
            assert(caller == self.vault.read(), 'IY: only vault can mint');
            self.erc20.mint(to, amount);
            self.emit(IYMinted { to, amount });
        }

        fn get_vault(self: @ContractState) -> ContractAddress {
            self.vault.read()
        }
    }
}
