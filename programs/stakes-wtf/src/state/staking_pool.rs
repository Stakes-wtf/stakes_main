use anchor_lang::prelude::*;

use crate::{constants::{GOV_PRICE_DENOMINATOR, SECONDS_PER_DAY, STAKING_POOL_SEED_PREFIX}, errors::StakesError, traits::AccountSpace};

#[account]
pub struct StakingPool {
    pub bump: [u8; 1],
    pub mint: Pubkey,
    pub gov_mint: Pubkey,
    pub gov_price: u64,
    pub active_balance: u64,
    pub last_bribe_distribution_timestamp: i64
}

impl AccountSpace for StakingPool {
    const SPACE: usize = 8 + 1 + 32 + 32 + 8 + 8 + 256;
}

impl StakingPool {
    pub fn new(
        bump: u8, mint: Pubkey, gov_mint: Pubkey
    ) -> Self {
        let last_bribe_distribution_timestamp: i64 = Clock::get().unwrap().unix_timestamp
            .checked_div(SECONDS_PER_DAY).unwrap()
            .checked_mul(SECONDS_PER_DAY).unwrap();
        Self {
            bump: [bump],
            mint,
            gov_mint,
            gov_price: GOV_PRICE_DENOMINATOR,
            active_balance: 0,
            last_bribe_distribution_timestamp
        }
    }

    pub fn into_seeds(&self) -> [&[u8]; 3] {
        [STAKING_POOL_SEED_PREFIX, self.mint.as_ref(), &self.bump]
    }

    pub fn add_to_active_balance(&mut self, amount: u64) -> Result<u64> {
        if let Some(new_balance) = self.active_balance.checked_add(amount) {
            self.active_balance = new_balance;
            Ok(new_balance)
        } else {
            Err(error!(StakesError::ValueOverflow))
        }
    }

    pub fn remove_from_active_balance(&mut self, amount: u64) -> Result<u64> {
        if let Some(new_balance) = self.active_balance.checked_sub(amount) {
            self.active_balance = new_balance;
            Ok(new_balance)
        } else {
            Err(error!(StakesError::ValueOverflow))
        }
    }
    
    pub fn get_gov_amount_for_stake(&self, stake_amount: u64) -> Result<u64> {
        let amount = stake_amount as u128 * self.gov_price as u128 / GOV_PRICE_DENOMINATOR as u128;
        if amount > u64::MAX as u128 {
            Err(error!(StakesError::ValueOverflow))
        } else {
            Ok(amount as u64)
        }
    }

    pub fn get_token_amount_for_unstake(&self, gov_amount: u64) -> Result<u64> {
        let amount = gov_amount as u128 * GOV_PRICE_DENOMINATOR as u128 / self.gov_price as u128;
        if amount > u64::MAX as u128 {
            Err(error!(StakesError::ValueOverflow))
        } else {
            Ok(amount as u64)
        }
    }

    pub fn get_current_bribe_amount(&self, total_balance: u64) -> u64 {
        if self.active_balance == 0 {
            return 0
        }

        let current_timestamp = Clock::get().unwrap().unix_timestamp;
        let periods_passed: i64 = (current_timestamp - self.last_bribe_distribution_timestamp) / SECONDS_PER_DAY;

        if periods_passed <= 0 {
            return 0
        }

        let total_bribes = total_balance - self.active_balance;
        let current_share = total_bribes * 5 / 100 * periods_passed as u64;
        let min_share = total_balance / 1000;

        if current_share >= total_bribes {
            total_bribes
        } else if current_share <= min_share {
            if min_share > total_bribes {
                total_bribes
            } else {
                min_share
            }
        } else {
            current_share
        }
    }

    pub fn sync_last_bribe_distribution_timestamp(&mut self) {
        self.last_bribe_distribution_timestamp = Clock::get().unwrap().unix_timestamp
            .checked_div(SECONDS_PER_DAY).unwrap()
            .checked_mul(SECONDS_PER_DAY).unwrap();
    }

    pub fn sync_gov_price(&mut self, gov_supply: u64) -> Result<u64> {
        if gov_supply == 0 {
            self.gov_price = GOV_PRICE_DENOMINATOR;
            return Ok(GOV_PRICE_DENOMINATOR)
        }
        let price = gov_supply as u128 * GOV_PRICE_DENOMINATOR as u128 / self.active_balance as u128;
        if price <= u64::MAX as u128 {
            self.gov_price = price as u64;
            Ok(self.gov_price)
        } else {
            Err(error!(StakesError::ValueOverflow))
        }
    }
}