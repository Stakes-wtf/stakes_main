use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::{
    constants::{STAKING_POOL_SEED_PREFIX, STAKING_VAULT_SEED_PREFIX},
    state::StakingPool,
    traits::{AccountSpace, Processor}
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitializePoolData {}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        seeds = [
            STAKING_POOL_SEED_PREFIX,
            mint.key().as_ref()
        ],
        bump,
        space = StakingPool::SPACE,
        payer = signer
    )]
    pub staking_pool: Account<'info, StakingPool>,

    pub mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        payer = signer,
        token::mint = mint,
        token::authority = staking_pool,
        seeds = [
            STAKING_VAULT_SEED_PREFIX,
            staking_pool.key().as_ref()
        ],
        bump
    )]
    pub staking_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = signer,
        mint::decimals = mint.decimals,
        mint::authority = staking_pool
    )]
    pub gov_mint: Box<Account<'info, Mint>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>
}

impl<'info> Processor<'info, InitializePoolData, InitializePoolBumps> for InitializePool<'info> {
    fn handle(ctx: Context<Self>, _data: InitializePoolData) -> Result<()> {
        ctx.accounts.staking_pool.set_inner(
            StakingPool::new(ctx.bumps.staking_pool, ctx.accounts.mint.key(), ctx.accounts.gov_mint.key())
        );

        Ok(())
    }
}