use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, Token, TokenAccount},
    token::{Burn, burn, transfer, Transfer}
};
use crate::{
    constants::{STAKING_POOL_SEED_PREFIX, STAKING_VAULT_SEED_PREFIX, VESTING_VAULT_SEED_PREFIX}, errors::StakesError, state::{StakingPool, VestingPosition}, traits::{AccountSpace, Processor}
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UnstakeData {}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = VestingPosition::SPACE
    )]
    pub vesting_position: Account<'info, VestingPosition>,
    #[account(
        init,
        payer = signer,
        token::mint = mint,
        token::authority = staking_pool,
        seeds = [
            VESTING_VAULT_SEED_PREFIX,
            vesting_position.key().as_ref()
        ],
        bump
    )]
    pub vesting_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [
            STAKING_POOL_SEED_PREFIX,
            staking_pool.mint.as_ref()
        ],
        bump = staking_pool.bump[0],
        has_one = gov_mint @ StakesError::InvalidMint,
        has_one = mint @ StakesError::InvalidMint
    )]
    pub staking_pool: Box<Account<'info, StakingPool>>,
    pub mint: Box<Account<'info, Mint>>,
    #[account(mut)]
    pub gov_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
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
        mut,
        associated_token::mint = gov_mint,
        associated_token::authority = signer
    )]
    pub user_gov_token: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>
}

impl<'info> Processor<'info, UnstakeData, UnstakeBumps> for Unstake<'info> {
    fn handle(ctx: Context<Self>, _data: UnstakeData) -> Result<()> {

        let amount = ctx.accounts.staking_pool.get_token_amount_for_unstake(ctx.accounts.user_gov_token.amount)?;
        ctx.accounts.staking_pool.remove_from_active_balance(amount)?;

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.staking_vault.to_account_info(),
                    to: ctx.accounts.vesting_vault.to_account_info(),
                    authority: ctx.accounts.staking_pool.to_account_info()
                },
                &[&ctx.accounts.staking_pool.into_seeds()]
            ),
            amount
        )?;

        ctx.accounts.vesting_position.set_inner(
            VestingPosition::new(
                ctx.accounts.staking_pool.key(),
                ctx.accounts.signer.key(),
                ctx.accounts.mint.key(),
                amount
            )
        );

        burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    authority: ctx.accounts.signer.to_account_info(),
                    from: ctx.accounts.user_gov_token.to_account_info(),
                    mint: ctx.accounts.gov_mint.to_account_info()
                }
            ),
            ctx.accounts.user_gov_token.amount
        )?;

        ctx.accounts.gov_mint.reload()?;

        if ctx.accounts.gov_mint.supply == 0 {
            ctx.accounts.staking_pool.sync_gov_price(0)?;
        }

        Ok(())
    }
}