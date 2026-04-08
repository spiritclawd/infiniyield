// Mock Yield Source — simulates Vesu/DeFi yield for testing
// The vault deposits wBTC here; owner can simulate_yield to add fake yield
// In production, this would be replaced by a real Vesu integration

#[starknet::contract]
pub mod MockYieldSource {
    use starknet::ContractAddress;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use infiniyield::interfaces::i_yield_source::IYieldSource;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        vault_balance: u256,
        accumulated_yield: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        YieldSimulated: YieldSimulated,
        YieldHarvested: YieldHarvested,
        Deposited: Deposited,
    }

    #[derive(Drop, starknet::Event)]
    struct YieldSimulated {
        amount: u256,
        new_total: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct YieldHarvested {
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Deposited {
        amount: u256,
        new_balance: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.vault_balance.write(0_u256);
        self.accumulated_yield.write(0_u256);
    }

    #[abi(embed_v0)]
    impl MockYieldSourceImpl of IYieldSource<ContractState> {
        /// Called by vault when depositing wBTC
        fn deposit(ref self: ContractState, amount: u256) {
            let new_balance = self.vault_balance.read() + amount;
            self.vault_balance.write(new_balance);
            self.emit(Deposited { amount, new_balance });
        }

        /// Owner calls this to simulate yield accrual (for testing)
        fn simulate_yield(ref self: ContractState, amount: u256) {
            let caller = starknet::get_caller_address();
            assert(caller == self.owner.read(), 'MockYield: only owner');
            let new_yield = self.accumulated_yield.read() + amount;
            self.accumulated_yield.write(new_yield);
            self.emit(YieldSimulated { amount, new_total: new_yield });
        }

        /// Called by vault to harvest yield — resets accumulated_yield to 0
        fn harvest(ref self: ContractState) -> u256 {
            let yield_amount = self.accumulated_yield.read();
            self.accumulated_yield.write(0_u256);
            self.emit(YieldHarvested { amount: yield_amount });
            yield_amount
        }

        fn get_balance(self: @ContractState) -> u256 {
            self.vault_balance.read()
        }

        fn get_accumulated_yield(self: @ContractState) -> u256 {
            self.accumulated_yield.read()
        }
    }
}
