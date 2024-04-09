use anchor_lang::{prelude::*, Bumps};

pub trait Processor<'info, DataT, BumpsT> where Self: Accounts<'info, BumpsT>, Self: Bumps {
    // fn validate(&self, _data: &DataT) -> Result<()> {
    //     Ok(())
    // }
    fn handle(_ctx: Context<Self>, _data: DataT) -> Result<()> {
        Ok(())
    }
}

pub trait AccountSpace {
    const SPACE: usize = 8 + 256;
}