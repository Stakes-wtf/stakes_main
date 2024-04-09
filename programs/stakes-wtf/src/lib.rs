use anchor_lang::prelude::*;

pub mod traits;
pub mod state;
pub mod constants;
pub mod instructions;
pub mod errors;

use instructions::*;
use traits::Processor;

declare_id!("stkWEMeJyUyoqZu6C65z21Vzt3CezXRuix7oqJ78RwS");

#[program]
pub mod stakes_wtf {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, data: InitializePoolData) -> Result<()> {
        InitializePool::handle(ctx, data)
    }

    pub fn sync_bribes(ctx: Context<SyncBribes>, data: SyncBribesData) -> Result<()> {
        SyncBribes::handle(ctx, data)
    }

    pub fn stake(ctx: Context<Stake>, data: StakeData) -> Result<()> {
        Stake::handle(ctx, data)
    }

    pub fn unstake(ctx: Context<Unstake>, data: UnstakeData) -> Result<()> {
        Unstake::handle(ctx, data)
    }

    pub fn claim_vested(ctx: Context<ClaimVested>, data: ClaimVestedData) -> Result<()> {
        ClaimVested::handle(ctx, data)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
