import { associatedTokenProgram, program, systemProgram, tokenProgram } from "@constants";
import { BN } from "@coral-xyz/anchor";
import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { InstructionBuilderResponse, StakingPool, VestingPosition } from "@types";
import { StakingPoolDerivation, StakingVaultDerivation, VestingVaultDerivation } from "@utils";


export async function createCreatePoolInstruction (
    wallet: AnchorWallet, mint: PublicKey
): Promise<InstructionBuilderResponse> {
    const govMintKeypair = Keypair.generate()

    const ix = await program.methods
    .initializePool({})
    .accounts({
        stakingPool: StakingPoolDerivation.derive(mint),
        mint,
        govMint: govMintKeypair.publicKey,
        signer: wallet.publicKey,
        stakingVault: StakingVaultDerivation.derive(mint),
        systemProgram,
        tokenProgram
    })
    .instruction()

    return {
        instructions: [ix],
        signers: [govMintKeypair]
    }
}

export async function createStakeInstruction (
    wallet: AnchorWallet, pool: StakingPool, amount: number
): Promise<InstructionBuilderResponse> {
    const ix = await program.methods
    .stake({ amount: new BN(amount) })
    .accounts({
        stakingPool: StakingPoolDerivation.derive(pool.mint),
        stakingVault: StakingVaultDerivation.derive(pool.mint),
        govMint: pool.govMint,
        userToken: getAssociatedTokenAddressSync(pool.mint, wallet.publicKey),
        userGovToken: getAssociatedTokenAddressSync(pool.govMint, wallet.publicKey),
        signer: wallet.publicKey,
        associatedTokenProgram,
        systemProgram,
        tokenProgram
    })
    .instruction()

    return {
        instructions: [ix],
        signers: []
    }
}

export async function createUnstakeInstruction (
    wallet: AnchorWallet, pool: StakingPool
): Promise<InstructionBuilderResponse> {
    const vestingPositionKeypair = Keypair.generate()

    const ix = await program.methods
    .unstake({})
    .accounts({
        stakingPool: StakingPoolDerivation.derive(pool.mint),
        stakingVault: StakingVaultDerivation.derive(pool.mint),
        govMint: pool.govMint,
        userGovToken: getAssociatedTokenAddressSync(pool.govMint, wallet.publicKey),
        mint: pool.mint,
        signer: wallet.publicKey,
        vestingPosition: vestingPositionKeypair.publicKey,
        vestingVault: VestingVaultDerivation.derive(vestingPositionKeypair.publicKey),
        systemProgram,
        tokenProgram
    })
    .instruction()

    return {
        instructions: [ix],
        signers: [vestingPositionKeypair]
    }
}

export async function createClaimInstruction (
    wallet: AnchorWallet, vestingPosition: VestingPosition
): Promise<InstructionBuilderResponse> {
    const ix = await program.methods
    .claimVested({})
    .accounts({
        vestingPosition: vestingPosition.address,
        vestingVault: VestingVaultDerivation.derive(vestingPosition.address),
        stakingPool: vestingPosition.stakingPool,
        mint: vestingPosition.mint,
        owner: wallet.publicKey,
        userToken: getAssociatedTokenAddressSync(vestingPosition.mint, wallet.publicKey),
        associatedTokenProgram,
        systemProgram,
        tokenProgram
    })
    .instruction()

    return {
        instructions: [ix],
        signers: []
    }
}

export async function createBribeInstruction (
    wallet: AnchorWallet, pool: StakingPool, amount: number
): Promise<InstructionBuilderResponse> {
    const ix = createTransferInstruction(
        getAssociatedTokenAddressSync(pool.mint, wallet.publicKey),
        StakingVaultDerivation.derive(pool.mint),
        wallet.publicKey,
        amount
    )
    return {
        instructions: [ix],
        signers: []
    }
}