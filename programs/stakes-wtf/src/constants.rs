pub const STAKING_POOL_SEED_PREFIX: &[u8] = b"staking_pool";
pub const STAKING_VAULT_SEED_PREFIX: &[u8] = b"staking_vault";
pub const VESTING_VAULT_SEED_PREFIX: &[u8] = b"vesting_vault";

pub const GOV_PRICE_DENOMINATOR: u64 = 1_000_000_000;

#[cfg(not(feature = "testing"))]
pub const SECONDS_PER_DAY: i64 = 24 * 60 * 60;
#[cfg(feature = "testing")]
pub const SECONDS_PER_DAY: i64 = 1;