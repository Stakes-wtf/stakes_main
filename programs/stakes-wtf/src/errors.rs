use anchor_lang::prelude::*;

#[error_code]
pub enum StakesError {
    #[msg("Invalid mint")]
    InvalidMint,
    #[msg("Invalid owner")]
    InvalidOwner,
    #[msg("Invalid pool")]
    InvalidPool,
    #[msg("Value overflow occured")]
    ValueOverflow
}