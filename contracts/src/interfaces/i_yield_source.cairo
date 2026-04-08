// Interface for yield sources (Vesu, mock, etc.)

#[starknet::interface]
pub trait IYieldSource<TContractState> {
    fn deposit(ref self: TContractState, amount: u256);
    fn simulate_yield(ref self: TContractState, amount: u256);
    fn harvest(ref self: TContractState) -> u256;
    fn get_balance(self: @TContractState) -> u256;
    fn get_accumulated_yield(self: @TContractState) -> u256;
}
