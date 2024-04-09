use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
    token::{MintTo, mint_to, transfer, Transfer}
};
use crate::{
    constants::{STAKING_POOL_SEED_PREFIX, STAKING_VAULT_SEED_PREFIX},
    state::StakingPool,
    traits::Processor,
    errors::StakesError
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct StakeData {
    amount: u64
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

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
    #[account(mut)]
    pub gov_mint: Account<'info, Mint>,

    #[account(
        mut,
        token::mint = staking_pool.mint,
        token::authority = staking_pool,
        seeds = [
            STAKING_VAULT_SEED_PREFIX,
            staking_pool.key().as_ref()
        ],
        bump
    )]
    pub staking_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = staking_pool.mint,
        associated_token::authority = signer
    )]
    pub user_token: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = gov_mint,
        associated_token::authority = signer
    )]
    pub user_gov_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>
}

impl<'info> Processor<'info, StakeData, StakeBumps> for Stake<'info> {
    fn handle(ctx: Context<Self>, data: StakeData) -> Result<()> {

        ctx.accounts.staking_pool.add_to_active_balance(data.amount)?;
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token.to_account_info(),
                    to: ctx.accounts.staking_vault.to_account_info(),
                    authority: ctx.accounts.signer.to_account_info()
                }
            ),
            data.amount
        )?;

        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.gov_mint.to_account_info(),
                    to: ctx.accounts.user_gov_token.to_account_info(),
                    authority: ctx.accounts.staking_pool.to_account_info()
                },
                &[&ctx.accounts.staking_pool.into_seeds()]
            ),
            ctx.accounts.staking_pool.get_gov_amount_for_stake(data.amount)?
        )?;

        Ok(())
    }
}