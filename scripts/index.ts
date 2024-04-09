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

const provider = AnchorProvider.env()
setProvider(provider);
const signer = provider.publicKey
const connection = provider.connection
const program = workspace.StakesWtf as Program<StakesWtf>;

const systemProgram = web3.SystemProgram.programId
const tokenProgram = TOKEN_PROGRAM_ID
const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID

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

async function main () {
    const pool = await program.account.stakingPool.all().then(accs => accs[0])
    console.log(pool)
    if (!pool) return
    await program.methods
    .syncBribes({})
    .accounts({
      govMint: pool.account.govMint,
      stakingPool: pool.publicKey,
      stakingVault: StakingVaultDerivation.derive(pool.account.mint)
    })
    .rpc()
    .then(t => console.log(t))
    .catch(e => console.log(e))
}

main()