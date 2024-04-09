import { AnchorProvider, BN, Program, setProvider, web3, workspace } from "@coral-xyz/anchor";
import { StakesWtf } from "../target/types/stakes_wtf";
import { ASSOCIATED_TOKEN_PROGRAM_ID, MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMint, createMintToInstruction, createTransferInstruction, getAccount, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, getMint } from "@solana/spl-token"
import { assert } from "chai";
import { xit } from "mocha";

function assertInRange (value: number, rangeBase: number, rangeDistance: number = 1) {
  assert(value >= rangeBase - rangeDistance && value <= rangeBase + rangeDistance)
}

async function wait(ms: number) {
  await new Promise(res => setTimeout(res, ms))
}

describe("stakes-wtf", () => {
  const provider = AnchorProvider.env()
  setProvider(provider);
  const signer = provider.publicKey
  const connection = provider.connection
  const program = workspace.StakesWtf as Program<StakesWtf>;

  const mintKeypair = web3.Keypair.generate()
  const mint = mintKeypair.publicKey
  const govMintKeypair = web3.Keypair.generate()
  const govMint = govMintKeypair.publicKey
  const mintDecimals = 6
  const mintSupply = 1_000_000_000
  const tokenAccount = getAssociatedTokenAddressSync(mint, signer)
  const govTokenAccount = getAssociatedTokenAddressSync(govMint, signer)
  const govPriceDenominator = 1_000_000_000

  const systemProgram = web3.SystemProgram.programId
  const tokenProgram = TOKEN_PROGRAM_ID
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID

  const vestingPositionKeypair = web3.Keypair.generate()
  const vestingPosition = vestingPositionKeypair.publicKey

  class PDADerivation<T> {
    getSeeds: (...args: T[]) => Buffer[]
  
    constructor(getSeeds: (...args: T[]) => Buffer[]) {
      this.getSeeds = getSeeds
    }
  
    public deriveWithBump(...args: T[]) {
      return web3.PublicKey.findProgramAddressSync(
        this.getSeeds(...args),
        program.programId
      )
    }

    public derive(...args: T[]) {
      return this.deriveWithBump(...args)[0]
    }
  }

  const StakingPoolDerivation = new PDADerivation(
    (mint: web3.PublicKey) => [Buffer.from("staking_pool"), mint.toBuffer()]
  )
  const StakingVaultDerivation = new PDADerivation(
    (mint: web3.PublicKey) => [Buffer.from("staking_vault"), StakingPoolDerivation.derive(mint).toBuffer()]
  )
  const VestingVaultDerivation = new PDADerivation(
    (vestingPosition: web3.PublicKey) => [Buffer.from("vesting_vault"), vestingPosition.toBuffer()]
  )

  const stakingPool = StakingPoolDerivation.derive(mint)
  const stakingVault = StakingVaultDerivation.derive(mint)
  const vestingVault = VestingVaultDerivation.derive(vestingPosition)

  before("Mint tokens", async () => {
    const lamports = await getMinimumBalanceForRentExemptMint(connection)
    
    const tx = new web3.Transaction()
    .add(
      web3.SystemProgram.createAccount({
        fromPubkey: signer,
        lamports,
        programId: TOKEN_PROGRAM_ID,
        newAccountPubkey: mint,
        space: MINT_SIZE
      }),
      createInitializeMint2Instruction(
        mint,
        mintDecimals,
        signer,
        signer
      ),
      createAssociatedTokenAccountInstruction(
        signer,
        tokenAccount,
        signer,
        mint
      ),
      createMintToInstruction(
        mint,
        tokenAccount,
        signer,
        mintSupply
      )
    )

    await provider.sendAndConfirm(tx, [mintKeypair])
  })

  it("Pool initialized", async () => {
    const tx = await program.methods
    .initializePool({})
    .accounts({
      signer,
      stakingPool,
      stakingVault,
      govMint,
      mint,
      systemProgram,
      tokenProgram
    })
    .signers([govMintKeypair])
    .rpc()

    await program.account.stakingPool.fetch(stakingPool)
    .then(a => {
      assert.equal(a.bump.length, 1)
      assert.equal(a.bump[0], StakingPoolDerivation.deriveWithBump(mint)[1])
      assert(a.mint.equals(mint))
      assert(a.govMint.equals(govMint))
      assert(a.govPrice.eq(new BN(govPriceDenominator)))
      const currentTimestamp = Math.floor(Date.now() / 1000)
      assertInRange(a.lastBribeDistributionTimestamp.toNumber(), currentTimestamp)
    })

    await getMint(connection, govMint)
    .then(a => {
      assert.equal(a.supply.toString(), "0")
      assert.equal(a.decimals, mintDecimals)
      assert(a.mintAuthority.equals(stakingPool))
    })
    
  });

  it("Stake 1000 tokens", async () => {
    await program.methods
    .stake({
      amount: new BN(1_000)
    })
    .accounts({
      signer,
      stakingPool,
      stakingVault,
      govMint,
      userToken: tokenAccount,
      userGovToken: govTokenAccount,
      associatedTokenProgram,
      systemProgram,
      tokenProgram
    })
    .rpc()

    await program.account.stakingPool.fetch(stakingPool)
    .then(a => {
      assert.equal(a.activeBalance.toNumber(), 1_000)
      assert.equal(a.govPrice.toNumber(), govPriceDenominator)
    })

    await getAccount(connection, govTokenAccount)
    .then(a => {
      assert(a.mint.equals(govMint))
      assert(a.owner.equals(signer))
      assert.equal(a.amount.toString(), "1000")
    })

    await getMint(connection, govMint)
    .then(a => {
      assert.equal(a.supply.toString(), "1000")
    })
  })

  it("Add 1000 tokens bribe", async () => {

    await program.methods
    .syncBribes({})
    .accounts({
      govMint,
      stakingPool,
      stakingVault
    })
    .preInstructions([
      createTransferInstruction(
        tokenAccount,
        stakingVault,
        signer,
        1_000
      )
    ])
    .rpc()

    await program.account.stakingPool.fetch(stakingPool)
    .then(a => {
      // 50 = 5% of a bribe
      assert.equal(a.activeBalance.toNumber(), 1050)
      assert.equal(a.govPrice.toNumber(), Math.floor(1000 * govPriceDenominator / 1050))
    })
  })

  it("Unstake all tokens", async () => {
    await program.methods
    .unstake({})
    .accounts({
      signer,
      stakingPool,
      stakingVault,
      vestingPosition,
      vestingVault,
      userGovToken: govTokenAccount,
      mint,
      govMint,
      systemProgram,
      tokenProgram
    })
    .signers([vestingPositionKeypair])
    .rpc()
    .catch(e => {
      console.log(e)
      throw ''
    })

    await program.account.stakingPool.fetch(stakingPool)
    .then(a => {
      assert.equal(a.activeBalance.toNumber(), 0)
      assert.equal(a.govPrice.toNumber(), govPriceDenominator)
    })

    await program.account.vestingPosition.fetch(vestingPosition)
    .then(a => {
      assert.equal(a.claimPerDay.toNumber(), Math.floor(1050 / 20))
      assert(a.mint.equals(mint))
      assert(a.stakingPool.equals(stakingPool))
      assert(a.owner.equals(signer))
      const currentTimestamp = Math.floor(Date.now() / 1000)
      assertInRange(a.lastClaimTimestamp.toNumber(), currentTimestamp)
    })

    await getAccount(connection, vestingVault)
    .then(a => {
      assert.equal(a.amount.toString(), (1050).toString())
    })
  })

  it("Sync bribes again (shouldn't credit anything since no staked tokens)", async () => {
    await program.methods
    .syncBribes({})
    .accounts({
      govMint,
      stakingPool,
      stakingVault
    })
    .rpc()

    await program.account.stakingPool.fetch(stakingPool)
    .then(a => {
      assert.equal(a.activeBalance.toNumber(), 0)
      assert.equal(a.govPrice.toNumber(), govPriceDenominator)
      const currentTimestamp = Math.floor(Date.now() / 1000)
      assertInRange(a.lastBribeDistributionTimestamp.toNumber(), currentTimestamp)
    })
  })

  it("Claim part from vesting after 1 sec", async () => {
    await program.methods
    .claimVested({})
    .accounts({
      stakingPool,
      owner: signer,
      vestingPosition,
      vestingVault,
      mint,
      userToken: tokenAccount,
      associatedTokenProgram,
      systemProgram,
      tokenProgram
    })
    .rpc()

    await getAccount(connection, vestingVault)
    .then(a => {
      assert.equal(a.amount.toString(), (1050 - Math.floor(1050/20)).toString())
    })

    await program.account.vestingPosition.fetch(vestingPosition)
    .then(a => {
      const currentTimestamp = Math.floor(Date.now() / 1000)
      assertInRange(a.lastClaimTimestamp.toNumber(), currentTimestamp)
    })
  })

  xit("Claim remaining vested tokens (accs should be closed)", async () => {
    await wait(20000)
    
    await program.methods
    .claimVested({})
    .accounts({
      stakingPool,
      owner: signer,
      vestingPosition,
      vestingVault,
      mint,
      userToken: tokenAccount,
      associatedTokenProgram,
      systemProgram,
      tokenProgram
    })
    .rpc()

    let err: any
    await getAccount(connection, vestingVault)
    .catch(e => err = e)

    assert.exists(err)

    await program.account.vestingPosition.fetchNullable(vestingPosition)
    .then(a => {
      assert.equal(a, null)
    })

  })
});
