use anchor_lang::prelude::*;

use crate::{constants::{SECONDS_PER_DAY, VESTING_UNLOCK_DAYS}, traits::AccountSpace};

#[account]
pub struct VestingPosition {
    pub staking_pool: Pubkey,
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub last_claim_timestamp: i64,
    pub claim_per_day: u64
}

impl AccountSpace for VestingPosition {
    const SPACE: usize = 8 + 32 + 32 + 32 + 8 + 8 + 256;
}

impl VestingPosition {
    pub fn new(
        staking_pool: Pubkey, owner: Pubkey, mint: Pubkey, amount: u64
    ) -> Self {
        let claim_per_day = amount / VESTING_UNLOCK_DAYS;
        let last_claim_timestamp: i64 = Clock::get().unwrap().unix_timestamp
            .checked_div(SECONDS_PER_DAY).unwrap()
            .checked_mul(SECONDS_PER_DAY).unwrap();
        Self {
            staking_pool,
            claim_per_day,
            last_claim_timestamp,
            mint,
            owner
        }
    }

    pub fn get_current_claim_amount (&self, token_balance: u64) -> (u64, bool) {
        let mut amount: u64 = 0;
        let current_timestamp = Clock::get().unwrap().unix_timestamp;
        let periods_passed: i64 = (current_timestamp - self.last_claim_timestamp) / SECONDS_PER_DAY;
        if periods_passed > 0 {
            amount = periods_passed as u64 * self.claim_per_day
        }
        // If there is not enough tokens for a new claim next day, return whole balance and mark bool = true to close account
        if token_balance < amount + self.claim_per_day {
            return (token_balance, true)
        } else {
            return (amount, false)
        }
    }

    pub fn sync_last_claim_timestamp(&mut self) {
        self.last_claim_timestamp = Clock::get().unwrap().unix_timestamp
            .checked_div(SECONDS_PER_DAY).unwrap()
            .checked_mul(SECONDS_PER_DAY).unwrap();
    }
}