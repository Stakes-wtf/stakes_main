use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer}
};
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::{
    constants::{FEE_RECEIVER_PUBKEY, INITIALIZE_POOL_FEE, STAKING_POOL_SEED_PREFIX, STAKING_VAULT_SEED_PREFIX},
    traits::{AccountSpace, Processor},
    errors::StakesError,
    state::StakingPool
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

    #[account(
        address = FEE_RECEIVER_PUBKEY @ StakesError::InvalidFeeReceiver
    )]
    pub fee_receiver: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>
}

impl<'info> Processor<'info, InitializePoolData, InitializePoolBumps> for InitializePool<'info> {
    fn handle(ctx: Context<Self>, _data: InitializePoolData) -> Result<()> {
        ctx.accounts.staking_pool.set_inner(
            StakingPool::new(ctx.bumps.staking_pool, ctx.accounts.mint.key(), ctx.accounts.gov_mint.key())
        );

        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.signer.to_account_info(),
                    to: ctx.accounts.fee_receiver.to_account_info()
                }
            ),
            INITIALIZE_POOL_FEE
        )?;

        Ok(())
    }
}