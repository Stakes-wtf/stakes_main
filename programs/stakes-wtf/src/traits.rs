use anchor_lang::{prelude::*, Bumps};

pub trait Processor<'info, DataT, BumpsT> where Self: Accounts<'info, BumpsT>, Self: Bumps {
    fn handle(_ctx: Context<Self>, _data: DataT) -> Result<()> {
        Ok(())
    }
}

pub trait AccountSpace {
    const SPACE: usize = 8 + 256;
}