use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};
use crate::{
    constants::{STAKING_POOL_SEED_PREFIX, STAKING_VAULT_SEED_PREFIX},
    state::StakingPool,
    traits::Processor,
    errors::StakesError
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct SyncBribesData {}

#[derive(Accounts)]
pub struct SyncBribes<'info> {
    #[account(
        mut,
        seeds = [
            STAKING_POOL_SEED_PREFIX,
            staking_pool.mint.as_ref()
        ],
        bump = staking_pool.bump[0],
        has_one = gov_mint @ StakesError::InvalidMint
    )]
    pub staking_pool: Account<'info, StakingPool>,
    pub gov_mint: Account<'info, Mint>,
    #[account(
        token::mint = staking_pool.mint,
        token::authority = staking_pool,
        seeds = [
            STAKING_VAULT_SEED_PREFIX,
            staking_pool.key().as_ref()
        ],
        bump
    )]
    pub staking_vault: Account<'info, TokenAccount>
}

impl<'info> Processor<'info, SyncBribesData, SyncBribesBumps> for SyncBribes<'info> {
    fn handle(ctx: Context<Self>, _data: SyncBribesData) -> Result<()> {

        let amount = ctx.accounts.staking_pool.get_current_bribe_amount(ctx.accounts.staking_vault.amount);
        if amount > 0 {
            ctx.accounts.staking_pool.add_to_active_balance(amount)?;
            ctx.accounts.staking_pool.sync_gov_price(ctx.accounts.gov_mint.supply)?;
        }
        ctx.accounts.staking_pool.sync_last_bribe_distribution_timestamp();
        
        Ok(())
    }
}