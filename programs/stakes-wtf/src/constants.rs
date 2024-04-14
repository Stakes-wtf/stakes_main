use anchor_lang::solana_program::pubkey::Pubkey;
use solana_program::pubkey;

pub const STAKING_POOL_SEED_PREFIX: &[u8] = b"staking_pool";
pub const STAKING_VAULT_SEED_PREFIX: &[u8] = b"staking_vault";
pub const VESTING_VAULT_SEED_PREFIX: &[u8] = b"vesting_vault";

pub const GOV_PRICE_DENOMINATOR: u64 = 1_000_000_000;

#[cfg(not(feature = "testing"))]
pub const SECONDS_PER_DAY: i64 = 24 * 60 * 60;
#[cfg(feature = "testing")]
pub const SECONDS_PER_DAY: i64 = 1;

// % * 10
pub const BRIBE_SHARE_PER_DAY: u64 = 50;
// % * 10
pub const BRIBE_MIN_SHARE_PER_DAY: u64 = 1;
pub const VESTING_UNLOCK_DAYS: u64 = 20;

#[cfg(not(feature = "testing"))]
pub const FEE_RECEIVER_PUBKEY: Pubkey = pubkey!("JDcx51iqLQPyDnRYWBKWm2zJRM6ZR62d5m2vEQVPniQW");
#[cfg(feature = "testing")]
pub const FEE_RECEIVER_PUBKEY: Pubkey = pubkey!("JDcx51iqLQPyDnRYWBKWm2zJRM6ZR62d5m2vEQVPniQW");

// Lamports
pub const INITIALIZE_POOL_FEE: u64 = 2_000_000_000;