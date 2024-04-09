use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
    token::{close_account, CloseAccount, transfer, Transfer}
};
use crate::{
    constants::{STAKING_POOL_SEED_PREFIX, VESTING_VAULT_SEED_PREFIX}, errors::StakesError, state::{StakingPool, VestingPosition}, traits::Processor
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct ClaimVestedData {}

#[derive(Accounts)]
pub struct ClaimVested<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = staking_pool @ StakesError::InvalidPool,
        has_one = mint @ StakesError::InvalidMint,
        has_one = owner @ StakesError::InvalidOwner
    )]
    pub vesting_position: Account<'info, VestingPosition>,
    #[account(
        mut,
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
        seeds = [
            STAKING_POOL_SEED_PREFIX,
            staking_pool.mint.as_ref()
        ],
        bump = staking_pool.bump[0],
        has_one = mint @ StakesError::InvalidMint
    )]
    pub staking_pool: Account<'info, StakingPool>,
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = owner
    )]
    pub user_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>
}

impl<'info> Processor<'info, ClaimVestedData, ClaimVestedBumps> for ClaimVested<'info> {
    fn handle(ctx: Context<Self>, _data: ClaimVestedData) -> Result<()> {

        let (amount, close_accs) = ctx.accounts.vesting_position.get_current_claim_amount(ctx.accounts.vesting_vault.amount);

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vesting_vault.to_account_info(),
                    to: ctx.accounts.user_token.to_account_info(),
                    authority: ctx.accounts.staking_pool.to_account_info()
                },
                &[&ctx.accounts.staking_pool.into_seeds()]
            ),
            amount
        )?;
        
        if close_accs {
            close_account(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    CloseAccount {
                        account: ctx.accounts.vesting_vault.to_account_info(),
                        authority: ctx.accounts.staking_pool.to_account_info(),
                        destination: ctx.accounts.owner.to_account_info()
                    },
                    &[&ctx.accounts.staking_pool.into_seeds()]
                )
            )?;
            ctx.accounts.vesting_position.close(
                ctx.accounts.owner.to_account_info()
            )?;
        } else {
            ctx.accounts.vesting_position.sync_last_claim_timestamp();
        }

        Ok(())
    }
}